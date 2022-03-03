export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'email',
            type: 'string',
        },
        {
            name: 'approved',
            title: 'Approved',
            type: 'boolean',
            description: "comments won't show on the site without approval"
        },
        {
            name: 'post',
            type: 'reference',
            to: [{ type: 'post' }],
        },
        {
            name: 'comment',
            type: 'text',
        },
    ],
}
