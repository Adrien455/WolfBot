
const state = {
    last_log_date: null,
    last_ledger_date: null,
    required: 500,
    members: new Map()
};

function get_member(member_id)
{
    const member = state.members.get(member_id)

    if(!member) // very unlikely
    {
        throw new Error("Member not in the clan anymore.")
    }

    return member;
}

module.exports = { state, get_member };