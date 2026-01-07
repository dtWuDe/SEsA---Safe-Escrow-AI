// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { EscrowStatus, Escrow } from "../types/EscrowTypes.sol";

interface IEscrow {
    // ===== Events =====
    event EscrowCreated(uint256 indexed id, address buyer, address seller, address arbitrator, uint256 amount);
    event EscrowReleased(uint256 indexed id, address buyer, address seller, uint256 amount);
    event EscrowRefunded(uint256 indexed id, address buyer, address seller, uint256 amount);
    
    // ===== Functions =====
        // ===== Core Functions =====
    function createEscrow(address _seller, address _arbitrator, uint256 _amount) external payable returns (uint256);
    function releaseFunds(uint256 _id) external;
    function refundFunds(uint256 _id) external;

        // ===== Ultility Functions =====
    function getEscrow(uint256 _id) external view returns (Escrow memory);
    function isActive(uint256 _id) external view returns (bool);
    function totalEscrows() external view returns (uint256);
}