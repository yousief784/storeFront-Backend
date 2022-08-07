enum statusEnum {
    'active',
    'compelate',
}

type Order = {
    id?: string;
    status?: statusEnum;
    user_id?: string;
    total?: number;
};

export default Order;
