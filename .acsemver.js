module.exports = {
    repository: {
        url: 'https://github.com/admiralcloud/ac-userTasks-service'
    },
    jira: {
        url: 'https://admiralcloud.atlassian.net'
    },
    changelogFile: __dirname + '/CHANGELOG.md',
    sections: [
        { name: 'UserTasks' },
        { name: 'Misc' },
    ]
};
