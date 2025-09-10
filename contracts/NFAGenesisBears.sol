// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFA Genesis Bears
 * @dev 710 Genesis Bears NFT collection for testing the membership platform
 */
contract NFAGenesisBears is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 710;
    uint256 public constant MAX_PER_WALLET = 5;
    
    string private _baseTokenURI;
    mapping(address => uint256) public mintedPerWallet;
    
    event BearMinted(address indexed to, uint256 indexed tokenId);
    
    constructor(address initialOwner) 
        ERC721("NFA Genesis Bears", "NFAB") 
        Ownable(initialOwner) 
    {
        _baseTokenURI = "https://nfabears.xyz/metadata/genesis/";
    }
    
    /**
     * @dev Mint Genesis Bears (owner only)
     */
    function mint(address to, uint256 quantity) external onlyOwner {
        require(quantity > 0, "Quantity must be greater than 0");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Would exceed max supply");
        require(mintedPerWallet[to] + quantity <= MAX_PER_WALLET, "Would exceed max per wallet");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(to, tokenId);
            mintedPerWallet[to]++;
            emit BearMinted(to, tokenId);
        }
    }
    
    /**
     * @dev Public mint for testing
     */
    function publicMint(uint256 quantity) external {
        require(quantity > 0 && quantity <= 3, "Invalid quantity");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Would exceed max supply");
        require(mintedPerWallet[msg.sender] + quantity <= MAX_PER_WALLET, "Would exceed max per wallet");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
            mintedPerWallet[msg.sender]++;
            emit BearMinted(msg.sender, tokenId);
        }
    }
    
    /**
     * @dev Check if address owns any Genesis Bears
     */
    function isGenesisBearHolder(address owner) external view returns (bool) {
        return balanceOf(owner) > 0;
    }
    
    /**
     * @dev Get all token IDs owned by address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        }
        
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
    
    /**
     * @dev Set base URI (owner only)
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }
    
    // Required overrides for multiple inheritance
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
