# 🎓 GradeBook — Blockchain-Based Student Record Management

A decentralized application (DApp) for storing, retrieving, and viewing student academic records using blockchain technology. GradeBook integrates a Solidity smart contract with a web frontend and MetaMask wallet.

## 📌 About the Project

GradeBook demonstrates how blockchain can be used to manage student records transparently. Student IDs, names, and marks are stored and retrieved through a smart contract, allowing users to interact with records using a connected wallet.

## ✨ Features

- 🔗 **MetaMask Integration** — Connect your wallet to interact with the DApp.
- ➕ **Add Student Records** — Store a student's ID, name, and marks on-chain.
- 🔍 **Search Student Records** — Retrieve a record using its Student ID.
- 📋 **View All Students** — Display stored student records in a table.
- 🔐 **Duplicate ID Protection** — Prevent duplicate Student IDs through smart-contract validation.
- 📊 **Marks Validation** — Accept marks from 0 to 100.
- 🧾 **Transaction Tracking** — Display transaction hashes and open transaction details in a blockchain explorer.
- 🌐 **Sepolia Network** — Interact with the deployed smart contract on the Sepolia test network.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| HTML5 | Webpage structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend logic and blockchain interaction |
| Ethers.js | Ethereum-compatible blockchain interaction |
| MetaMask | Wallet connection and transaction approval |
| Remix IDE | Smart contract development and deployment |
| Sepolia | Blockchain test network |

## ⚙️ How It Works

1. Connect your MetaMask wallet.
2. Enter the student's ID, name, and marks.
3. Approve the transaction in MetaMask.
4. The smart contract validates the record and stores it on-chain.
5. Retrieve individual records or display all stored students.
6. View transaction hashes to inspect blockchain transactions.

## 📜 Smart Contract

**Contract Address (Sepolia):**

`0x9F7F6287dAE640CE37c7bb9a3fdfa2EC630c5DCD`

[View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x9F7F6287dAE640CE37c7bb9a3fdfa2EC630c5DCD)

### Main Functions

- `Add_Student()` — Adds a student record.
- `Get_Student()` — Retrieves a student by ID.
- `Get_All_Students()` — Returns all student records.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- MetaMask wallet
- Sepolia test ETH for transaction fees
- Node.js and npm, if using a local npm-based frontend setup

### Installation

1. Clone this repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Open the project folder:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install the frontend dependencies if a `package.json` is included:

   ```bash
   npm install
   ```

4. Start your local development server using the command configured in your project.

5. Open the application in your browser, connect MetaMask, and select the Sepolia network.

> **Note:** The frontend uses an Ethers.js module import. Run it through a compatible local development server rather than opening the HTML file directly. Adjust the commands to match your actual project configuration.

## 🧪 Testing

The following functionality has been tested:

- MetaMask wallet connection and reconnection
- Adding student records
- Retrieving individual student records
- Displaying all student records
- Viewing transaction hashes
- Duplicate Student ID rejection
- Marks validation, including boundary values of 0 and 100
- Rejection of marks above 100

## 🔮 Future Improvements

- Student record update functionality
- Improved error handling and user feedback
- Role-based access control for authorized record management
- Enhanced UI and accessibility
- Deployment of the frontend to a public hosting platform

## 🎯 Learning Outcomes

Through this project, I explored:

- Solidity smart contract development
- Connecting a web frontend to a blockchain
- MetaMask wallet integration
- Reading blockchain data and submitting transactions
- Smart-contract validation and transaction tracking

## 👨‍💻 Author

**Rehan Ansari**

Blockchain Development | Solidity | JavaScript | Web3

---

⭐ If you find this project useful, consider giving the repository a star.
