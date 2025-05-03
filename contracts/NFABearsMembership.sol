// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFABearsMembership is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("NFA Bears Miracle", "MIRACLE") Ownable(msg.sender) {}

    function mintMembership(address to) external returns (uint256) {
        require(!_hasMinted[to], "Wallet already has an SBT");
        _hasMinted[to] = true;
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function hasMinted(address wallet) external view returns (bool) {
        return _hasMinted[wallet];
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soul-bound: non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("Soul-bound: non-transferable");
    }
} 