// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFABearsMembership is ERC721, Ownable, AccessControl {
    uint256 private _tokenIdCounter;
    mapping(address => bool) private _hasMinted;
    
    // Role for authorized minters (relayer servers)
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Events
    event MinterGranted(address indexed minter);
    event MinterRevoked(address indexed minter);
    event MembershipMinted(address indexed to, uint256 tokenId);

    constructor() ERC721("NFA Bears Miracle", "MIRACLE") Ownable(msg.sender) {
        // Grant deployer admin role and initial minter role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintMembership(address to) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(!_hasMinted[to], "Wallet already has an SBT");
        require(to != address(0), "Cannot mint to zero address");
        
        _hasMinted[to] = true;
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        
        emit MembershipMinted(to, tokenId);
        return tokenId;
    }
    
    // Admin functions for role management
    function grantMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
        emit MinterGranted(minter);
    }
    
    function revokeMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
        emit MinterRevoked(minter);
    }
    
    function isMinter(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }
    
    function getTotalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function hasMinted(address wallet) external view returns (bool) {
        return _hasMinted[wallet];
    }

    function transferFrom(address /*from*/, address /*to*/, uint256 /*tokenId*/) public virtual override {
        revert("Soul-bound: non-transferable");
    }

    function safeTransferFrom(address /*from*/, address /*to*/, uint256 /*tokenId*/, bytes memory /*data*/) public virtual override {
        revert("Soul-bound: non-transferable");
    }
    
    // Override supportsInterface to support both ERC721 and AccessControl
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
} 