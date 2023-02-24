enum ChainType {
    ESC = "ESC",
    ETH = "ETH",
    FSN = "FSN"
}

const chainTypes: ChainType[] = [
    ChainType.ESC,
    ChainType.ETH,
    ChainType.FSN
]

const getChainTypes = (): string[] => {
    return chainTypes;
}

const chainIdMapType = {
    20:     ChainType.ESC,
    21:     ChainType.ESC,
    1:      ChainType.ETH,
    3:      ChainType.ETH,
    32659:  ChainType.FSN,
    46688:  ChainType.FSN,
}

const getChainTypeById = (chainId: number): string => {
    return chainIdMapType[chainId]
}

const chainTypeToIndex = new Map<ChainType, number>([
    [ChainType.ESC, 1],
    [ChainType.ETH, 2],
    [ChainType.FSN, 3]
])

const getChainIndexByType = (chaintype:ChainType) => {
    return chainTypeToIndex[chaintype];
}

export {
    ChainType,
    getChainTypes,
    getChainTypeById,
    getChainIndexByType
}
