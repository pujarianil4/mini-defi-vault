// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Vault {
    // Mapping to store user balances
    mapping(address => uint256) public balances;
    
    // Event to emit when ETH is deposited
    event Deposited(address indexed user, uint256 amount);
    
    // Event to emit when ETH is withdrawn
    event Withdrawn(address indexed user, uint256 amount);
    
    // Function to deposit ETH
    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    // Function to withdraw ETH
    function withdraw(uint256 amount) public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        // Withdraw full balance if amount is 0 or greater than available balance
        if (amount == 0 || amount > balance) {
            amount = balance;
        }

        // Update balance before transferring ETH (to prevent reentrancy)
        balances[msg.sender] -= amount;

        // Transfer ETH to the user
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }
    
    // Function to get user's balance
    function getBalanceFor(address user) public view returns (uint256) {
        return balances[user];
    }

       // Handle direct ETH transfers
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    fallback() external payable {
        revert("Invalid transaction");
    }
} 