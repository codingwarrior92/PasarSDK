enum ListType {
    FixedPrice = "FixedPrice",
    OnAuction = "OnAuction"
}

const getListTypes = (): ListType[] => {
    return [ListType.FixedPrice, ListType.OnAuction]
}

const isOnAuction = (type:string): boolean => {
    return ListType.OnAuction == type;
}

export {
    ListType,
    getListTypes,
    isOnAuction
}
