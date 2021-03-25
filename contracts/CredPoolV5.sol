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
Bunch of views for user specific data
Tracking borrow and deposit transactions
Add interest rate
*/
contract CredPoolV5 {
	// fixed interest rate
	uint INITIAL_DAI = 300000;
	uint interestRate = 10;
	uint daiReserve;
	// time variables that track start date and maturity if the pool
	uint starttime;
	uint endtime;

	// dai address
	// address public DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
	address public DAI_ADDRESS;
	ICToken public CToken;
	IERC20 public dai; 

	struct BorrowTransaction {
		uint id;
		uint amount;
		uint borrowedTime;
		uint repayedTime;
		uint interestRate;
		uint totalAmount;
	}

	struct DepositTransaction {
		uint id;
		uint amount;
		uint depositedTime;
		uint withdrewTime;
		uint interestRate;
		uint totalAmount;
	}

    // An address type variable is used to store owner account address
    address public owner;
	// TODO: need to rename the IsNotFirstBorrowTransaction and
	// rework on the workflow to track the first transaction of the user
	mapping(address => bool) IsNotFirstBorrowTransaction;
	mapping(address => uint) BorrowTransactionCountMap;
	mapping(address => mapping(uint => BorrowTransaction)) BorrowTransactionsMap;
	mapping(address => bool) IsNotFirstDepositTransaction;
	mapping(address => uint) DepositTransactionCountMap;
	mapping(address => mapping(uint => DepositTransaction)) DepositTransactionsMap;

	constructor(address _dai_address) {
		DAI_ADDRESS = _dai_address;
		dai = IERC20(DAI_ADDRESS);
        owner = msg.sender;
		dai.transferFrom(msg.sender, address(this), INITIAL_DAI);
		starttime = block.timestamp;
		endtime = starttime + 30 days;
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
		dai.approve(address(this), amount);
		dai.transferFrom(msg.sender, address(this), amount);
		ICToken(_ctoken).transfer(msg.sender, amount);
		uint depositTransactionCount;
		uint currentInterestRate = getCurrentInterestRate();
		if (!IsNotFirstDepositTransaction[msg.sender]) {
			depositTransactionCount = 1;
			IsNotFirstDepositTransaction[msg.sender] = true;
		} else {
			depositTransactionCount = DepositTransactionCountMap[msg.sender] + 1;
		}
		DepositTransaction memory depositTransaction = DepositTransaction(
			depositTransactionCount,
			amount,
			block.timestamp,
			0,
			currentInterestRate,
			amount
		);
		DepositTransactionsMap[msg.sender][depositTransactionCount] = depositTransaction;
		DepositTransactionCountMap[msg.sender] = depositTransactionCount;
	}

	function withdraw(uint transaction_id, address _ctoken) external {
		// fetching the transaction
		DepositTransaction memory transaction = DepositTransactionsMap[msg.sender][transaction_id];
		// updating the transaction
		transaction.withdrewTime = block.timestamp;
		DepositTransactionsMap[msg.sender][transaction_id] = transaction;
		dai.transferFrom(address(this), msg.sender, transaction.amount);
		ICToken(_ctoken).transferFrom(msg.sender, address(this), transaction.amount);
	}

	function borrow(uint amount, address _ctoken) external {
		dai.transferFrom(address(this), msg.sender, amount);
		ICToken(_ctoken).mint(address(this), amount);
		uint borrowTransactionCount;
		uint currentInterestRate = getCurrentInterestRate();
		if (!IsNotFirstBorrowTransaction[msg.sender]) {
			borrowTransactionCount = 1;
			IsNotFirstBorrowTransaction[msg.sender] = true;
		} else {
			borrowTransactionCount = BorrowTransactionCountMap[msg.sender] + 1;
		}
		BorrowTransaction memory borrowTransaction = BorrowTransaction(
			borrowTransactionCount,
			amount,
			block.timestamp,
			0,
			currentInterestRate,
			amount
		);
		BorrowTransactionsMap[msg.sender][borrowTransactionCount] = borrowTransaction;
		BorrowTransactionCountMap[msg.sender] = borrowTransactionCount;
	}

	function repay(uint transaction_id, address _ctoken) external {
		// fetching the transaction
		BorrowTransaction memory transaction = BorrowTransactionsMap[msg.sender][transaction_id];
		uint totalAmount = getTotalAmountForBorrowTransaction(transaction);
		// console.log(totalAmount);
		// updating the transaction
		// TODO: have to rethink anout time calculations
		transaction.repayedTime = block.timestamp;
		transaction.totalAmount = totalAmount;
		BorrowTransactionsMap[msg.sender][transaction_id] = transaction;
		dai.transferFrom(msg.sender, address(this), transaction.totalAmount);
		ICToken(_ctoken).burn(address(this), transaction.totalAmount);
	}

	/******* VIEWS ********/
	/******* interest rare calculations ********/
	// TODO: have to work on the function modifier
	function getCurrentInterestRate() internal pure returns (uint) {
		return 10;
	}

	function getCurrentInterestRateView() external view returns (uint) {
		uint currentInterestRate = getCurrentInterestRate();
		return currentInterestRate;
	}

	function getPoolMaturityDates() external view returns (uint, uint) {
		return (starttime, endtime);
	}

	function getTotalAmountForBorrowTransaction(BorrowTransaction memory borrowTransaction) internal returns (uint) {
		uint currentInterestRate = getCurrentInterestRate();
		uint currentTime = block.timestamp;
		uint maturityTime = endtime - starttime;
		uint timeLapse = currentTime - starttime;
		uint amount = borrowTransaction.amount;
		// console.log(timeLapse);
		// console.log(maturityTime);
		uint timeLapsePercent = timeLapse/maturityTime;
		// console.log(timeLapsePercent);
		uint interestAmount = amount*currentInterestRate*timeLapsePercent;
		// console.log(interestAmount);
		interestAmount = interestAmount/100;
		// console.log(interestAmount);
		uint totalAmount = amount + interestAmount;
		// return borrowTransaction.totalAmount;
		return totalAmount;
	}

	/******* pool balances ********/
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
		uint borrowTransactionCount;
		uint totalAmount;
		BorrowTransaction memory borrowTransaction;
		if (!IsNotFirstBorrowTransaction[msg.sender]) {
			borrowTransactionCount = 0;
		} else {
			borrowTransactionCount = BorrowTransactionCountMap[msg.sender];
		}
		BorrowTransaction[] memory transactions =  new BorrowTransaction[](borrowTransactionCount);

		for(uint i=0; i<borrowTransactionCount; i++) {
			borrowTransaction = BorrowTransactionsMap[msg.sender][i+1];
			// totalAmount = getTotalAmountForBorrowTransaction(borrowTransaction);
			// borrowTransaction.totalAmount = totalAmount;
			transactions[i] = borrowTransaction;
		}

		return transactions;
	}

	function getUserDepositTransactions() external view returns (DepositTransaction [] memory) {
		uint depositTransactionCount;
		DepositTransaction memory depositTransaction;
		if (!IsNotFirstDepositTransaction[msg.sender]) {
			depositTransactionCount = 0;
		} else {
			depositTransactionCount = DepositTransactionCountMap[msg.sender];
		}
		DepositTransaction[] memory transactions =  new DepositTransaction[](depositTransactionCount);

		for(uint i=0; i<depositTransactionCount; i++) {
			depositTransaction = DepositTransactionsMap[msg.sender][i+1];
			transactions[i] = depositTransaction;
		}

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
