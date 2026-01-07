// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// ==== Enums =====
enum EscrowStatus {
    AWAITING_RELEASE,
    RELEASED,
    REFUNDED,
    DISPUTED,
    RESOLVED,
    NONE
}

// ==== Structs =====
struct Escrow {
    address buyer;
    address seller;
    address arbitrator;
    uint256 amount;
    EscrowStatus status;
}