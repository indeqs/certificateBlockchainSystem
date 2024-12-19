// SPDX-License-Identifier: GPL-3.0

// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 -> approved University
// 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db -> Bill's Address
// 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB
// 0x617F2E2fD72FD9D5503197092aC168c91465E7f2
// 0x17F6AD8Ef982297579C203069C1DbfFE4348c372

pragma solidity ^0.8.0;

/**
 * @dev As I'm overriding function safeTransferFrom which calls _checkOnERC721Received inside it(see line 161 in ERC721.sol)
 *      that part of the codebase is unreachable hence the warning.
 *
 * @dev _checkOnERC721Received is a private function that invokes {IERC721Receiver-onERC721Received} on a target address.
 *       It reverts if the recipient doesn't accept the token transfer which is exactly what I'm doing with our overrides
 *       The call is not executed if the target address is not a contract.
 */

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract Project is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address public owner;

    // List of approved university addresses
    mapping(address => bool) public approvedUniversities;

    // A struct to keep track of crucial student metadata
    struct StudentMetadata {
        string universityName;
        string studentName;
        string degreeEarned;
        string dateOfGraduation;
    }

    mapping(uint256 => StudentMetadata) private _studentMetadata;

    event CertificateUploaded(
        uint256 indexed tokenId,
        string universityName,
        string studentName,
        string degreeEarned,
        string dateOfGraduation
    );

    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner");
        _;
    }

    modifier onlyApprovedUniversity() {
        require(
            approvedUniversities[msg.sender],
            "Caller is not an approved university"
        );
        _;
    }

    constructor() ERC721("Degree", "DGR") {
        owner = msg.sender;
    }

    /**
     * @dev Adds a university address to the list of approved universities.
     * @param university The address of the university to approve.
     */
    function approveUniversity(address university) external onlyOwner {
        approvedUniversities[university] = true;
    }

    /**
     * @dev Removes a university address from the list of approved universities.
     * @param university The address of the university to remove.
     */
    function revokeUniversityApproval(address university) external onlyOwner {
        approvedUniversities[university] = false;
    }

    /**
     * @dev Stores certificate metadata onto the blockchain. Only approved universities can store certificate metadata.
     * @param universityName The name of the university attended
     * @param studentName The name of the student
     * @param degreeEarned The name of the degree earned, e.g., Bachelor of Science in Computer Security and Forensics
     * @param dateOfGraduation The date the student graduated from the university
     */
    /// should all these "sensitive" information be stored on-chain on a public blockchain like Ethereum?
    function storeMetadata(
        string memory universityName,
        string memory studentName,
        string memory degreeEarned,
        string memory dateOfGraduation
    ) external onlyApprovedUniversity {
        uint256 tokenId = _tokenIdCounter.current();

        _studentMetadata[tokenId] = StudentMetadata({
            universityName: universityName,
            studentName: studentName,
            degreeEarned: degreeEarned,
            dateOfGraduation: dateOfGraduation
        });

        emit CertificateUploaded(
            tokenId,
            universityName,
            studentName,
            degreeEarned,
            dateOfGraduation
        );

        _tokenIdCounter.increment();
    }

    /**
     * @dev Mints an NFT of a particular token Id to `recipient`. Only approved universities can mint.
     * @param recipient Who are you minting to?
     */
    /// minted NFTs should ideally be stored on-chain(SVG with gov't logo)
    function mint(address recipient) external onlyApprovedUniversity {
        require(recipient != address(0), "Recipient address is 0");

        uint256 tokenId = _tokenIdCounter.current();
        _mint(recipient, tokenId);
    }

    /**
     * @dev Gets detailed student metadata for the NFT using the token Id. Anyone can call this function.
     * @param tokenId The NFT token Id
     * @return universityName The name of the university that issued the degree
     * @return studentName The name of the student who earned the degree
     * @return degreeEarned The specific degree earned by the student
     * @return dateOfGraduation The date when the student graduated
     */
    function getStudentMetadata(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory universityName,
            string memory studentName,
            string memory degreeEarned,
            string memory dateOfGraduation
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token ID does not exist");
        StudentMetadata storage data = _studentMetadata[tokenId];
        return (
            data.universityName,
            data.studentName,
            data.degreeEarned,
            data.dateOfGraduation
        );
    }

    /// @dev Overrides to prevent the transfer and sell of their NFTs as they are individual.
    /// @dev You don't sell your University degree, do you? That's exactly what we're doing with these overrides

    function approve(address, uint256) public pure override {
        revert("Approval is disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Approval for all is disabled");
    }

    function transferFrom(address, address, uint256) public pure override {
        revert("Transfers are disabled");
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override {
        revert("Transfers are disabled");
    }
}
