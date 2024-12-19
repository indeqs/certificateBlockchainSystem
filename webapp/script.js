// Initialize Web3, Contract and handle MetaMask connection
document.addEventListener('DOMContentLoaded', async function () {
    let web3;
    let contract;
    const abi = [[
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "university",
                    "type": "address"
                }
            ],
            "name": "approveUniversity",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721IncorrectOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721InsufficientApproval",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOperator",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721NonexistentToken",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "universityName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "degreeEarned",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "dateOfGraduation",
                    "type": "string"
                }
            ],
            "name": "CertificateUploaded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "university",
                    "type": "address"
                }
            ],
            "name": "revokeUniversityApproval",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "universityName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "degreeEarned",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "dateOfGraduation",
                    "type": "string"
                }
            ],
            "name": "storeMetadata",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "approvedUniversities",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getStudentMetadata",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "universityName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "degreeEarned",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "dateOfGraduation",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "pure",
            "type": "function"
        }
    ]];
    const contractAddress = '0xbc5a034809FCD3840dc1E11DF3E6c27D1B70C1C7';


    document.getElementById('connect-wallet-btn').addEventListener('click', async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                alert('Wallet connected');

                document.getElementById('main-section').style.display = 'block';
                document.getElementById('welcome-section').style.display = 'none';

                // Initialize contract
                contract = new web3.eth.Contract(abi, contractAddress);
            } catch (error) {
                console.error(error);
                alert('Failed to connect wallet');
            }
        } else {
            alert('Please install MetaMask!');
        }
    });

    // Upload certificate and extract information
    document.getElementById('upload-btn').addEventListener('click', async () => {
        const files = document.getElementById('file-input').files;
        if (files.length > 0) {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';

            Array.from(files).forEach((file) => {
                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const typedArray = new Uint8Array(this.result);
                    pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                        pdf.getPage(1).then(function (page) {
                            page.getTextContent().then(function (textContent) {
                                const textItems = textContent.items.map(item => item.str).join('\n');
                                const lines = textItems.split(/\r\n|\n/).map(line => line.trim()).filter(Boolean);

                                let degreeEarned = 'Degree not found';
                                let studentName = 'Student name not found';
                                const degreeIndex = lines.findIndex(line => line.includes('Bachelor Degree'));
                                if (degreeIndex !== -1 && degreeIndex + 2 < lines.length) {
                                    degreeEarned = `${lines[degreeIndex]} ${lines[degreeIndex + 1]}`;
                                    studentName = lines[degreeIndex + 2];
                                }

                                let universityName = 'University not found';
                                const atIndex = lines.findIndex(line => line.includes('at '));
                                if (atIndex !== -1) {
                                    const universityLines = [];
                                    for (let i = atIndex; i < lines.length; i++) {
                                        if (lines[i].includes('University') || universityLines.length > 0) {
                                            universityLines.push(lines[i]);
                                            if (lines[i].includes('.')) break;
                                        }
                                    }
                                    if (universityLines.length > 0) {
                                        universityName = universityLines.join(' ').split('at ')[1]?.split('.')[0].trim() || universityName;
                                    }
                                }

                                let graduationDate = 'Graduation date not found';
                                const graduationDateLine = lines.find(line => line.startsWith('Date:'));
                                if (graduationDateLine) {
                                    graduationDate = graduationDateLine.split(':')[1]?.trim() || graduationDate;
                                }

                                const resultHTML = `
                                    <div class="result">
                                        <h2>Extracted Information</h2>
                                        <p><strong>University Name:</strong> ${universityName}</p>
                                        <p><strong>Student Name:</strong> ${studentName}</p>
                                        <p><strong>Degree Earned:</strong> ${degreeEarned}</p>
                                        <p><strong>Date of Graduation:</strong> ${graduationDate}</p>
                                    </div>
                                `;
                                resultsContainer.innerHTML += resultHTML;
                            });
                        });
                    });
                };
                fileReader.readAsArrayBuffer(file);
            });
        } else {
            alert("Please upload at least one PDF file.");
        }
    });

    // Mint Certificate NFT
    document.getElementById('mint-btn').addEventListener('click', async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const metadata = { /* Extracted certificate metadata */ };
            const tx = await contract.methods.mint(metadata).send({ from: accounts[0] });
            alert('NFT Minted Successfully: ' + tx.transactionHash);
        } catch (error) {
            console.error(error);
            alert('Error minting NFT: ' + error.message);
        }
    });

    // Search for NFT
    document.getElementById('search-btn').addEventListener('click', async () => {
        const nftId = document.getElementById('search-nft-id').value;
        if (nftId) {
            try {
                const metadata = await contract.methods.getStudentMetadata(nftId).call();
                const searchResultsContainer = document.getElementById('search-results-container');
                searchResultsContainer.innerHTML = `
                    <table>
                        <tr>
                            <th>University Name</th>
                            <th>Student Name</th>
                            <th>Degree Earned</th>
                            <th>Date of Graduation</th>
                        </tr>
                        <tr>
                            <td>${metadata.universityName}</td>
                            <td>${metadata.studentName}</td>
                            <td>${metadata.degreeEarned}</td>
                            <td>${metadata.graduationDate}</td>
                        </tr>
                    </table>
                `;
            } catch (error) {
                console.error(error);
                alert('Error fetching NFT metadata: ' + error.message);
            }
        } else {
            alert('Please enter an NFT ID to search.');
        }
    });
});
