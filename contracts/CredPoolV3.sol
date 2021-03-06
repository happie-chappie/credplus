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
There is no interest rate
*/
contract CredPoolV3 {
	// fixed interest rate
	uint INITIAL_DAI = 300000;
	uint interestRate = 10;
	uint daiReserve;

	// dai address
	// address public DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
	address public DAI_ADDRESS;
	ICToken public CToken;
	IERC20 public dai; 

    // An address type variable is used to store ethereum accounts.
    address public owner;

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

	function approveCTokenTransfer(uint amount, address _ctoken) external returns (bool) {
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

	function getCTokenBalance(address _ctoken) external view returns (uint) {
		uint balance = ICToken(_ctoken).balanceOf(address(this));
		return balance;
	}

	function getUserDAIBalance() external view returns (uint) {
		uint balance = dai.balanceOf(msg.sender);
		return balance;
	}

	function getUserCTokenBalance(address _ctoken) external view returns (uint) {
		uint balance = ICToken(_ctoken).balanceOf(msg.sender);
		return balance;
	}
}

/*

		// ICToken(_ctoken).approve(msg.sender, amount);
		// uint balance = ICToken(_ctoken).balanceOf(address(this));
		// console.log("=============");
		// console.log(amount);
		// console.log(balance);
*/
