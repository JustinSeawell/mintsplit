// contracts/MintSplitSharedLib.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MintSplitSharedLibV1 {
    struct ProjectParams {
        string projectName;
        string symbol;
        uint contentCount;
        uint[] supplyLimits;
        uint mintPrice;
        uint mintLimit;
        uint releaseTime;
        string baseURI;
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
}