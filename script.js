
import { ethers } from "ethers";

/* =====================================
   CONTRACT CONFIGURATION
===================================== */

const contractAddress =
    "0x9F7F6287dAE640CE37c7bb9a3fdfa2EC630c5DCD";

const SEPOLIA_CHAIN_ID = 11155111n;

const ABI = [
    {
        inputs: [
            { name: "_StudentId", type: "uint256" },
            { name: "_StudentName", type: "string" },
            { name: "_StudentMarks", type: "uint256" }
        ],
        name: "Add_Student",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: "StudentId", type: "uint256" },
            { indexed: false, name: "StudentName", type: "string" },
            { indexed: false, name: "StudentMarks", type: "uint256" }
        ],
        name: "StudentAdded",
        type: "event"
    },
    {
        inputs: [],
        name: "Get_All_Students",
        outputs: [
            { name: "", type: "uint256[]" },
            { name: "", type: "string[]" },
            { name: "", type: "uint256[]" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ name: "_StudentId", type: "uint256" }],
        name: "Get_Student",
        outputs: [
            { name: "Student_ID", type: "uint256" },
            { name: "Student_Name", type: "string" },
            { name: "Student_Marks", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    }
];

/* =====================================
   GLOBAL VARIABLES
===================================== */

let provider = null;
let signer = null;
let contract = null;
let currentChainId = "";

const walletButton = document.getElementById("wallet");
const studentForm = document.getElementById("Student-form");
const tableBody = document.getElementById("studentsTableBody");
const findForm = document.getElementById("find");
const recordInput = document.getElementById("record");
const findButton = document.getElementById("findbut");
const studentDetails = document.getElementById("studentDetails");

/* =====================================
   HELPERS
===================================== */

function storageKey(studentId) {
    return `student_tx_${currentChainId}_${contractAddress.toLowerCase()}_${studentId}`;
}

function explorerLink(hash) {
    if (currentChainId === "11155111") {
        return `https://sepolia.etherscan.io/tx/${hash}`;
    }
    return null;
}

function showMessage(container, title, message, icon = "📄") {
    if (!container) return;

    container.replaceChildren();

    const iconElement = document.createElement("div");
    iconElement.className = "empty-icon";
    iconElement.textContent = icon;

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    container.append(iconElement, heading, paragraph);
}

function showWrongNetwork() {
    if (walletButton) walletButton.textContent = "Switch to Sepolia";

    if (tableBody) {
        tableBody.innerHTML =
            '<tr><td colspan="6">Please switch MetaMask to Sepolia.</td></tr>';
    }

    showMessage(
        studentDetails,
        "Wrong Network",
        "GradeBook works only on Sepolia. Switch your MetaMask network.",
        "⚠️"
    );
}

function clearConnection(message = "Connect MetaMask to continue.") {
    provider = null;
    signer = null;
    contract = null;
    currentChainId = "";

    if (walletButton) walletButton.textContent = "Connect Wallet";

    if (tableBody) {
        tableBody.innerHTML =
            `<tr><td colspan="6">${message}</td></tr>`;
    }

    showMessage(studentDetails, "Wallet not connected", message);
}

/* Check network before every contract operation. */
async function ensureSepolia() {
    if (!window.ethereum) {
        alert("Please install MetaMask first.");
        return false;
    }

    if (!provider) {
        alert("Please connect your wallet first.");
        return false;
    }

    const network = await provider.getNetwork();
    currentChainId = network.chainId.toString();

    if (network.chainId !== SEPOLIA_CHAIN_ID) {
        contract = null;
        signer = null;
        showWrongNetwork();
        return false;
    }

    return true;
}

/* =====================================
   CONNECT WALLET
===================================== */

async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask first.");
        return;
    }

    try {
        walletButton.disabled = true;

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        if (!accounts.length) {
            clearConnection();
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);

        const network = await provider.getNetwork();
        currentChainId = network.chainId.toString();

        if (network.chainId !== SEPOLIA_CHAIN_ID) {
            signer = null;
            contract = null;
            showWrongNetwork();
            alert("Wrong network! Please switch MetaMask to Sepolia.");
            return;
        }

        signer = await provider.getSigner();

        contract = new ethers.Contract(
            contractAddress,
            ABI,
            signer
        );

        const account = await signer.getAddress();

        walletButton.textContent =
            `${account.slice(0, 6)}...${account.slice(-4)}`;

        console.log("Connected account:", account);
        console.log("Chain ID:", currentChainId);

        await loadStudents();

    } catch (error) {
        console.error("Wallet connection error:", error);
        alert(error.shortMessage || error.message || "Unable to connect wallet.");
    } finally {
        walletButton.disabled = false;
    }
}

walletButton?.addEventListener("click", connectWallet);

/* =====================================
   ADD STUDENT
===================================== */

studentForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        if (!await ensureSepolia()) return;

        const id = document.getElementById("studentId").value.trim();
        const name = document.getElementById("studentName").value.trim();
        const marks = document.getElementById("studentMarks").value.trim();

        if (!id || !name || marks === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (!/^\d+$/.test(id) || !/^\d+$/.test(marks)) {
            alert("Student ID and marks must be valid non-negative integers.");
            return;
        }

        if (BigInt(marks) > 100n) {
            alert("Marks must be between 0 and 100.");
            return;
        }

        const saveButton = document.getElementById("stdbut");
        saveButton.disabled = true;
        saveButton.textContent = "Waiting for confirmation...";

        try {
            const tx = await contract.Add_Student(
                BigInt(id),
                name,
                BigInt(marks)
            );

            localStorage.setItem(storageKey(id), tx.hash);

            const receipt = await tx.wait();

            if (!receipt || receipt.status !== 1) {
                throw new Error("Transaction failed.");
            }

            alert("Student record added successfully!");
            studentForm.reset();
            await loadStudents();
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "💾 Save Record";
        }
    } catch (error) {
        console.error("Add student error:", error);
        alert(error.reason || error.shortMessage || error.message || "Unable to add student.");
    }
});

/* =====================================
   FIND TRANSACTION HASH
===================================== */

async function findStudentTransaction(studentId) {
    if (!await ensureSepolia()) return null;

    try {
        const latestBlock = await provider.getBlockNumber();
        const chunkSize = 2000;

        for (let end = latestBlock; end >= 0; end -= chunkSize) {
            const start = Math.max(0, end - chunkSize + 1);

            const events = await contract.queryFilter(
                contract.filters.StudentAdded(),
                start,
                end
            );

            for (let i = events.length - 1; i >= 0; i--) {
                const event = events[i];

                if (
                    event.args &&
                    event.args.StudentId.toString() === String(studentId)
                ) {
                    return event.transactionHash;
                }
            }
        }
    } catch (error) {
        console.warn("Transaction search failed:", error);
    }

    return null;
}

/* =====================================
   VIEW STUDENT
===================================== */

async function viewStudent(studentId) {
    try {
        if (!await ensureSepolia()) return;

        const student = await contract.Get_Student(BigInt(studentId));

        alert(
            `Student Details\n\n` +
            `Student ID: ${student[0].toString()}\n` +
            `Name: ${student[1]}\n` +
            `Marks: ${student[2].toString()}/100`
        );
    } catch (error) {
        console.error("View student error:", error);
        alert(error.reason || error.shortMessage || "Student record could not be found.");
    }
}

/* =====================================
   LOAD ALL STUDENTS
===================================== */

async function loadStudents() {
    if (!tableBody) return;
    if (!await ensureSepolia()) return;

    tableBody.innerHTML =
        '<tr><td colspan="6">Loading student records...</td></tr>';

    try {
        const [ids, names, marks] = await contract.Get_All_Students();

        tableBody.replaceChildren();

        if (ids.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="6">No student records yet.</td></tr>';
            return;
        }

        for (let i = 0; i < ids.length; i++) {
            const studentId = ids[i].toString();

            let txHash = localStorage.getItem(storageKey(studentId));

            if (!txHash) {
                txHash = await findStudentTransaction(studentId);

                if (txHash) {
                    localStorage.setItem(storageKey(studentId), txHash);
                }
            }

            const row = document.createElement("tr");

            [i + 1, studentId, names[i], marks[i].toString()].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = String(value);
                row.appendChild(cell);
            });

            const hashCell = document.createElement("td");

            if (txHash) {
                const url = explorerLink(txHash);

                if (url) {
                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent =
                        `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
                    link.title = txHash;
                    hashCell.appendChild(link);
                }

                const copyButton = document.createElement("button");
                copyButton.type = "button";
                copyButton.textContent = "Copy";

                copyButton.addEventListener("click", async () => {
                    try {
                        await navigator.clipboard.writeText(txHash);
                        alert("Transaction hash copied!");
                    } catch {
                        prompt("Copy transaction hash:", txHash);
                    }
                });

                hashCell.appendChild(copyButton);
            } else {
                hashCell.textContent = "Hash not found";
            }

            row.appendChild(hashCell);

            const actionCell = document.createElement("td");
            const viewButton = document.createElement("button");

            viewButton.type = "button";
            viewButton.textContent = "View";
            viewButton.addEventListener("click", () => viewStudent(studentId));

            actionCell.appendChild(viewButton);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Load students error:", error);

        tableBody.innerHTML =
            '<tr><td colspan="6">Unable to load records. Check your network and contract address.</td></tr>';
    }
}

window.loadStudents = loadStudents;
window.viewStudent = viewStudent;

/* =====================================
   SEARCH STUDENT BY ID
===================================== */

findForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentId = recordInput.value.trim();

    if (!/^\d+$/.test(studentId)) {
        alert("Please enter a valid Student ID.");
        return;
    }

    try {
        if (!await ensureSepolia()) return;

        findButton.disabled = true;
        findButton.textContent = "Fetching Record...";

        showMessage(
            studentDetails,
            "Please wait",
            "Fetching record from blockchain...",
            "⏳"
        );

        const student = await contract.Get_Student(BigInt(studentId));

        studentDetails.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "Student Record Found";

        const idText = document.createElement("p");
        idText.textContent = `Student ID: ${student[0].toString()}`;

        const nameText = document.createElement("p");
        nameText.textContent = `Student Name: ${student[1]}`;

        const marksText = document.createElement("p");
        marksText.textContent = `Student Marks: ${student[2].toString()}/100`;

        studentDetails.append(heading, idText, nameText, marksText);
        studentDetails.classList.add("record-found");
    } catch (error) {
        console.error("Find student error:", error);

        showMessage(
            studentDetails,
            "No record found",
            error.reason || error.shortMessage || "Unable to fetch this record."
        );

        studentDetails.classList.remove("record-found");
    } finally {
        findButton.disabled = false;
        findButton.textContent = "🔍 Get Record";
    }
});

/* =====================================
   ACCOUNT / NETWORK CHANGES
===================================== */

if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
        clearConnection("Wallet account changed. Connect again to continue.");
    });

    window.ethereum.on("chainChanged", () => {
        clearConnection("Network changed. Connect again to verify Sepolia.");
        window.location.reload();
    });
}
