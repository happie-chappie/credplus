//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./dependencies/IERC20.sol";
import "./ICToken.sol";

/*
This version of the credpool handles two types of users
Borrowers
	- Borrow
	- Repay
Depositors
	- Deposit
	- Withdraw
There is no interest rate
*/
contract CredPoolV4 {
	// fixed interest rate
	uint INITIAL_DAI = 300000;
	uint interestRate = 10;
	uint daiReserve;

	// dai address
	// address public DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
	address public DAI_ADDRESS;
	ICToken public CToken;
	IERC20 public dai; 

	struct BorrowTransaction {
		uint amount;
		uint borrowedTime;
		uint repayeddTime;
	}

    // An address type variable is used to store owner account address
    address public owner;
	mapping(address => bool) IsNotFirstBorrowTransaction;
	mapping(address => uint) BorrowTransactionCountMap;
	mapping(address => mapping(uint => BorrowTransaction)) BorrowTransactionsMap;

	constructor(address _dai_address) {
		DAI_ADDRESS = _dai_address;
		dai = IERC20(DAI_ADDRESS);
        owner = msg.sender;
		dai.transferFrom(msg.sender, address(this), INITIAL_DAI);
	}

	function approveDAITransfer(uint amount) external returns (bool) {
		dai.approve(address(this), amount);
		return true;
	}

	function approveCredTokenTransfer(uint amount, address _ctoken) external returns (bool) {
		ICToken(_ctoken).approve(address(this), amount);
		return true;
	}

	function deposit(uint amount, address _ctoken) external {
		// console.log(amount);
		// console.log(dai.balanceOf(msg.sender));
		dai.approve(address(this), amount);
		dai.transferFrom(msg.sender, address(this), amount);
		ICToken(_ctoken).transfer(msg.sender, amount);
	}

	function withdraw(uint amount, address _ctoken) external {
		dai.transferFrom(address(this), msg.sender, amount);
		ICToken(_ctoken).transferFrom(msg.sender, address(this), amount);
	}

	function borrow(uint amount, address _ctoken) external {
		dai.transferFrom(address(this), msg.sender, amount);
		ICToken(_ctoken).mint(address(this), amount);
		uint borrowTransactionCount;
		if (!IsNotFirstBorrowTransaction[msg.sender]) {
			borrowTransactionCount = 1;
			IsNotFirstBorrowTransaction[msg.sender] = true;
		} else {
			borrowTransactionCount = BorrowTransactionCountMap[msg.sender] + 1;
		}
		BorrowTransaction memory borrowTransaction = BorrowTransaction(
			amount,
			block.timestamp,
			0
		);
		// if (!borrowTransactionCount) {
		// borrowTransactionCount = 1;
		// }
		BorrowTransactionsMap[msg.sender][borrowTransactionCount] = borrowTransaction;
		BorrowTransactionCountMap[msg.sender] = borrowTransactionCount;
	}

	function repay(uint amount, address _ctoken) external {
		dai.transferFrom(msg.sender, address(this), amount);
		ICToken(_ctoken).burn(address(this), amount);
	}

	/******* VIEWS ********/
	function getDAIBalance() external view returns (uint) {
		uint balance = dai.balanceOf(address(this));
		return balance;
	}

	function getCredTokenBalance(address _ctoken) external view returns (uint) {
		uint balance = ICToken(_ctoken).balanceOf(address(this));
		return balance;
	}

	/******** user balances ********/
	function getUserDAIBalance() external view returns (uint) {
		uint balance = dai.balanceOf(msg.sender);
		return balance;
	}

	function getUserCredTokenBalance(address _ctoken) external view returns (uint) {
		uint balance = ICToken(_ctoken).balanceOf(msg.sender);
		return balance;
	}

	/******** user transactions ********/
	function getUserBorrowTransactions() external view returns (BorrowTransaction [] memory) {
		// uint balance = dai.balanceOf(msg.sender);
		// return BorrowTransactionsMap[msg.sender];
		uint borrowTransactionCount;
		// return 1;
		if (!IsNotFirstBorrowTransaction[msg.sender]) {
			borrowTransactionCount = 0;
			// IsNotFirstBorrowTransaction[msg.sender] = true;
		} else {
			borrowTransactionCount = BorrowTransactionCountMap[msg.sender];
		}
		BorrowTransaction[] memory transactions =  new BorrowTransaction[](borrowTransactionCount);

		for(uint i=0; i<borrowTransactionCount; i++) {
			transactions[i] = BorrowTransactionsMap[msg.sender][i];
		}

		// return transactions[0:borrowTransactionCount-1];
		return transactions;
	}
}

/*

		// ICToken(_ctoken).approve(msg.sender, amount);
		// uint balance = ICToken(_ctoken).balanceOf(address(this));
		// console.log("=============");
		// console.log(amount);
		// console.log(balance);
*/
