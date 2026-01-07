// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

enum Param {
    Buyer,
    Seller,
    Arbitrator,
    Amount, 
    EscrowID
}

error InvalidParams(Param param);
error InvalidAmount();
error Unauthorized();
error InvalidRelation();
error InvalidState();
error TransferFailed();