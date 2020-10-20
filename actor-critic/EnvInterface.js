class EnvInterface {
    constructor(environment) {
        this.environment = environment

        this.actions_length = 4
        this.state_length = 9


        this.data = [
            
        ]
    }

    connect() {}

    init() {}

    async getState() {
        return await this.environment.getState()
    }

    action(actionIndex) {
        this.environment.action(actionIndex)
    }
}

module.exports = EnvInterface;