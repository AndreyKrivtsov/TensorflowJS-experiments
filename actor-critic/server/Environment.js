class Environment {
    constructor(emitter = null) {
        this.fieldSize = 6
        this.actor = { x: 0, y: 0 }
        this.eat = { x: 5, y: 5 }
        this.emitter = emitter
    }

    getConfig() {
        return {
            actor: this.actor,
            eat: this.eat,
            size: this.fieldSize
        }
    }

    reset() {
        this.actor = { x: 0, y: 0 }
        if (this.emitter) this.emitter.emit('reset', this.getState())
        else throw 'Error event emitter'
    }

    action(index) {
        if (index === 0) if (this.actor.y > 0) this.actor.y--
        if (index === 1) if (this.actor.x < this.fieldSize - 1) this.actor.x++
        if (index === 2) if (this.actor.y < this.fieldSize - 1) this.actor.y++
        if (index === 3) if (this.actor.x > 0) this.actor.x--

        if (this.emitter) this.emitter.emit('onaction')
        else throw 'Error event emitter'
    }

    getState() {
        let actorPos = this.actor.y * this.fieldSize + this.actor.x
        let state = new Array(this.fieldSize * this.fieldSize).fill(0)
        state[actorPos] = 1
        let reward = this.actor.x === this.eat.x && this.actor.y === this.eat.y

        return {
            state: state,
            reward: Number(reward)
        }
    }
}

module.exports = Environment
