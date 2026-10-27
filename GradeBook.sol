// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GradeBook {
    struct Student {
        uint256 StudentId;
        string StudentName;
        uint256 StudentMarks;
    }

    mapping(uint256 Id => Student) students;
    mapping(uint256 Id => bool) check;

    uint256[]  studentid;

    function Add_Student(uint256 _StudentId,string memory _StudentName,uint256 _StudentMarks) public {
        require(_StudentMarks <= 100, "Marks must be lie in  0-100");
        require(check[_StudentId] == false, "Student is Already Exist");
        students[_StudentId] = Student(_StudentId, _StudentName, _StudentMarks);
        check[_StudentId] = true;
        emit StudentAdded(_StudentId, _StudentName, _StudentMarks);
        studentid.push(_StudentId);
    }

    function Get_Student(uint256 _StudentId)public view returns (uint256 Student_ID,string memory Student_Name,uint256 Student_Marks){
        require(check[_StudentId], "Student does not exist");
        Student memory s = students[_StudentId];
        return (s.StudentId, s.StudentName, s.StudentMarks);
    }
    event StudentAdded(
        uint256 StudentId,
        string StudentName,
        uint256 StudentMarks
    );
    function Get_All_Students()public view returns (uint256[] memory, string[] memory, uint256[] memory){
        uint256 len = studentid.length;
        uint256[] memory ids = new uint256[](len);
        string[] memory names = new string[](len);
        uint256[] memory marks = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            uint256 id = studentid[i];
            Student memory s = students[id];

            ids[i] = s.StudentId;
            names[i] = s.StudentName;
            marks[i] = s.StudentMarks;
        }

        return (ids, names, marks);
    }
}
