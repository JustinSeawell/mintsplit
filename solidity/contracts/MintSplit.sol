// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MintSplit {
    struct Params {
        string name;
        string symbol;
        string baseURI;
        uint mintPrice;
        uint releaseTime;
    }
    
    struct PaymentSplit {
        address payable[] recipients;
        uint[] bps;
    }

    struct PaymentSplitConfig {
        uint contentId;
        bool isMint;
        PaymentSplit split;
    }

    struct Content {
        uint256 id;
        uint256 editions;
        string uri;
    }
}