// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// ===== Errors =====
import { InvalidParams, InvalidAmount, InvalidRelation, InvalidState, Unauthorized, Param, TransferFailed} from "../errors/Errors.sol";

// ===== Types =====
import { Escrow, EscrowStatus } from "../types/EscrowTypes.sol";

// ===== Interfaces =====
import { IEscrow } from "../interfaces/IEscrow.sol";

// ===== Libraries =====
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SEsA is IEscrow, ReentrancyGuard {
    uint256 private NextEscrowID;
    mapping (uint256 => Escrow) private escrows;

    function createEscrow(address _seller, address _arbitrator, uint256 _amount) 
    external 
    payable 
    returns (uint256 id) {
        // Validation
        if (msg.value != _amount) revert InvalidAmount();
        if (_arbitrator == address(0)) revert InvalidParams(Param.Arbitrator);
        if (_seller == address(0)) revert InvalidParams(Param.Seller);
        if (_amount == 0) revert InvalidParams(Param.Amount);
        if (msg.sender == _seller) revert InvalidRelation();
        if (_arbitrator == msg.sender || _arbitrator == _seller) revert InvalidRelation();
        
        // Create Escrow
        id = NextEscrowID++;
        escrows[id] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            arbitrator: _arbitrator,
            amount: _amount,
            status: EscrowStatus.AWAITING_RELEASE
        });

        // Emit Event
        emit EscrowCreated(id, msg.sender, _seller, _arbitrator, _amount);
        return id;
    }

    function releaseFunds(uint256 _id) external nonReentrant {
        // Validation
        if (_id >= NextEscrowID) revert InvalidParams(Param.EscrowID);
        Escrow storage e = escrows[_id];
        if (msg.sender != e.buyer && msg.sender != e.arbitrator) revert Unauthorized();
        if (e.status != EscrowStatus.AWAITING_RELEASE) revert InvalidState();
        
        Escrow memory snap = e;

        delete escrows[_id];
        // Release Funds
        (bool success, ) = payable(snap.seller).call{value: snap.amount}("");
        if (!success) revert TransferFailed();
        
        // Emit Event
        emit EscrowReleased(_id, snap.buyer, snap.seller, snap.amount);
    }

    function refundFunds(uint256 _id) external nonReentrant {
        // Validaition 
        if (_id >= NextEscrowID) revert InvalidParams(Param.EscrowID);
        Escrow storage e = escrows[_id];
        if (msg.sender != e.seller && msg.sender != e.arbitrator) revert Unauthorized();
        if (e.status != EscrowStatus.AWAITING_RELEASE) revert InvalidState();
        
        Escrow memory snap = e;

        // delete Escrow
        delete escrows[_id];
        // Refund Funds
        (bool success, ) = payable(snap.buyer).call{value: snap.amount}("");
        if (!success) revert TransferFailed();
        
        // Emit Event
        emit EscrowRefunded(_id, snap.buyer, snap.seller, snap.amount);
        
    }

    function getEscrow(uint256 _id) external view override returns (Escrow memory) {
        if (_id >= NextEscrowID) revert InvalidParams(Param.EscrowID);
        if (escrows[_id].buyer == address(0)) revert InvalidState();

        return escrows[_id];
    }

    function isActive(uint256 _id) external view returns (bool) {
        if (_id >= NextEscrowID) revert InvalidParams(Param.EscrowID);
        Escrow storage e = escrows[_id];

        return e.status == EscrowStatus.AWAITING_RELEASE;
    }

    function totalEscrows() external view returns (uint256) {
        return NextEscrowID;
    }
}