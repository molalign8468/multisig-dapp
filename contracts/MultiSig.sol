// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28; // Updated pragma to a more recent stable version within 0.8.x

/// @title MultiSig - A simple multi-signature wallet contract
/// @author Your Name (Molalign Getahun)
/// @notice This contract allows multiple owners to control funds, requiring a minimum number of confirmations for transactions.
contract MultiSig {

    // State variables
    address[] public owners; 
    mapping(address => bool) public isOwner; 
    uint public transactionCount; 
    uint public immutable required; 

    // Transaction structure
    struct Transaction {
        address payable destination; 
        uint value;                  
        bytes data;                  
        bool executed;   
    }

    // Mappings to track transactions and confirmations
    mapping(uint => Transaction) public transactions; 
    mapping(uint => mapping(address => bool)) public confirmations; 

    // Events for logging actions
    event Deposit(address indexed sender, uint value);
    event Submission(uint indexed transactionId);
    event Confirmation(uint indexed transactionId, address indexed sender);
    event Revocation(uint indexed transactionId, address indexed sender);
    event Execution(uint indexed transactionId);
    event ExecutionFailed(uint indexed transactionId); 

    // Constructor to initialize the contract with owners and required confirmations
    constructor(address[] memory _owners, uint _requiredConfirmations) {
        require(_owners.length > 0, "MultiSig: Owners array cannot be empty.");
        require(_requiredConfirmations > 0, "MultiSig: Required confirmations must be greater than 0.");
        require(_requiredConfirmations <= _owners.length, "MultiSig: Required confirmations exceeds total owners.");

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "MultiSig: Invalid owner address (zero address).");
            require(!isOwner[owner], "MultiSig: Duplicate owner address provided.");
            isOwner[owner] = true;       
            owners.push(owner);         
        }
        required = _requiredConfirmations;
    }
    // Fallback function to accept Ether deposits
    receive() payable external {
        emit Deposit(msg.sender, msg.value);
    }

    // Function to submit a new transaction
    function submitTransaction(
        address payable _destination,
        uint _value,
        bytes memory _data
    ) external returns (uint transactionId) {
        require(isOwner[msg.sender], "MultiSig: Caller is not an owner.");
        transactionId = transactionCount;
        transactions[transactionId] = Transaction(_destination, _value, _data, false);
        transactionCount++;

        emit Submission(transactionId);
        confirmTransaction(transactionId);
        return transactionId;
    }

  // Function to confirm a transaction
    function confirmTransaction(uint _transactionId) public {
        require(isOwner[msg.sender], "MultiSig: Caller is not an owner.");
        require(_transactionId < transactionCount, "MultiSig: Transaction does not exist.");
        require(!transactions[_transactionId].executed, "MultiSig: Transaction already executed.");
        require(!confirmations[_transactionId][msg.sender], "MultiSig: Transaction already confirmed by this owner.");
        confirmations[_transactionId][msg.sender] = true;
        emit Confirmation(_transactionId, msg.sender);
        if (getConfirmationsCount(_transactionId) >= required) {
            executeTransaction(_transactionId);
        }
    }

    // Function to revoke a confirmation for a transaction
    function revokeConfirmation(uint _transactionId) public {
        require(isOwner[msg.sender], "MultiSig: Caller is not an owner.");
        require(_transactionId < transactionCount, "MultiSig: Transaction does not exist.");
        require(!transactions[_transactionId].executed, "MultiSig: Transaction already executed.");
        require(confirmations[_transactionId][msg.sender], "MultiSig: Transaction not confirmed by this owner.");

        confirmations[_transactionId][msg.sender] = false;
        emit Revocation(_transactionId, msg.sender);
    }
    // Function to execute a confirmed transaction
    function executeTransaction(uint _transactionId) public {
        require(isOwner[msg.sender], "MultiSig: Caller is not an owner."); 
        require(_transactionId < transactionCount, "MultiSig: Transaction does not exist.");
        require(!transactions[_transactionId].executed, "MultiSig: Transaction already executed."); // Re-entrancy guard part 1
        require(getConfirmationsCount(_transactionId) >= required, "MultiSig: Not enough confirmations to execute.");

        Transaction storage _tx = transactions[_transactionId];
        _tx.executed = true; //(Re-entrancy guard part 2)

        (bool success, ) = _tx.destination.call{value: _tx.value}(_tx.data);
        if (success) {
            emit Execution(_transactionId);
        } else {
            _tx.executed = false; 
            emit ExecutionFailed(_transactionId);
            revert("MultiSig: Transaction execution failed.");
        }
    }

   // Function to check if a transaction is confirmed
    function isConfirmed(uint _transactionId) public view returns (bool) {
        return getConfirmationsCount(_transactionId) >= required;
    }
    function getConfirmationsCount(uint _transactionId) public view returns (uint count) {
        require(_transactionId < transactionCount, "MultiSig: Transaction does not exist.");
        count = 0; 
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[_transactionId][owners[i]]) {
                count++;
            }
        }
    }

   // Function to get details of a transaction
    function getTransaction(uint _transactionId)
        public
        view
        returns (
            address payable destination,
            uint value,
            bytes memory data,
            bool executed,
            uint confirmationsCount
        )
    {
        require(_transactionId < transactionCount, "MultiSig: Transaction does not exist.");
        Transaction storage _tx = transactions[_transactionId];
        return (
            _tx.destination,
            _tx.value,
            _tx.data,
            _tx.executed,
            getConfirmationsCount(_transactionId)
        );
    }

  // Function to get the list of owners
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

// Function to get the number of required confirmations
    function getRequired() public view returns (uint) {
        return required;
    }
 // Function to get the total number of transactions
    function getTransactionCount() public view returns (uint) {
        return transactionCount;
    }
}