//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
import "hardhat/console.sol";

import "./interfaces/SafeERC20.sol";

contract Escrow {
	using SafeERC20 for IERC20;
    address arbiter;
    address depositor;
    address beneficiary;
    uint initialBalance;
	uint temp = 3000;
	event StringFailure(string stringFailure);
    event BytesFailure(bytes bytesFailure);

    // aave interest bearing DAI
    // IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    // the DAI stablecoin 
	// address public USDTAddress = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
	// address USDTAddress = 0x6b175474e89094c44da98b954eedeac495271d0f;
	// IERC20 usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
	IERC20 usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    // IERC20 usdt = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    constructor(address _arbiter, address _beneficiary, uint _amount) {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        initialBalance = _amount;

        // TODO: transfer dai to this contract
    }

    function approve() external returns (bool){
		console.log("===============");
		console.log(address(this));
		console.log(msg.sender);
		usdt.safeTransferFrom(msg.sender, address(this), temp);
		// console.log(usdt);
        // usdt.transfer(address(this), initialBalance);
        // usdt.transferFrom(msg.sender, address(this), temp);

		// try addContract.add(_a, _b) returns (uint256 _value) {
		/*
		try  usdt.transferFrom(msg.sender, address(this), temp) returns (bool _value) {
			console.log(_value);
            return (_value);
			// return (true);
        } catch Error(string memory _err) {
			console.log("===== sadsada =====");
            emit StringFailure(_err);
			return false;
        } catch (bytes memory _err) {
			console.log("===== sadsada =====");
            emit BytesFailure(_err);
			return false;
        }
		*/

    }
	/*
	*/
}
