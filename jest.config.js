module.exports = {
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        '/node_modules/'   // 기본적으로 node_modules는 무시
    ],
    testEnvironmentOptions: {
        resources: "usable"
    }
};
