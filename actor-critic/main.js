const EnvInterface = require('./EnvInterface.js');
const Agent = require('./Agent.js');
const Io = require('./Io.js')

exports = module.exports = async (offline = false) => {
    //const io = new server()
    // const environment = new EnvInterface(io)
    // setInterval(async () => {
    //     console.log('getState')
    //     console.log(await environment.getState())
    // }, 2000)

    // setInterval(() => {
    //     console.log('action')
    //     environment.action(1)
    // }, 10000)
    
    let zeros = (w, h, v=0) => Array.from(new Array(h), _ => Array(w).fill(v));


    // let episode_done = false;
    // if(!offline)
    //     await environment.init();

    // //let data = environment.getEnvironmentData();
    // const AMOUNT_ACTIONS = environment.actions_length;
    // const STATE_SIZE = environment.state_length;

    // let agent = new Agent(STATE_SIZE, AMOUNT_ACTIONS);
    // let reward_plotting = {};
    let episode_length = 0;
    // for(let i = 0; i < Object.values(data.websites).length; i++) {
        episode_done = false;
        // reward_plotting[i] = 0;

        // let state = environment.reset(i);


        let i = 0
        
        while(false) {
            // data = environment.getEnvironmentData();
            // console.log('Episode '+i+' : '+(data.current_step+1)+'/'+(data.length_episode+1));

            console.log('Episode '+i);

            let action = agent.get_action(state, data.actions);
            let step_data = await environment.step(action);
            let next_state = step_data.state,
                reward = step_data.reward,
                done = step_data.done;
            
            // episode_length = step_data.episode_length;

            // reward_plotting[i] += reward < 0 ? 1: 0;
            agent.train_model(state, action, reward, next_state, done);

            if(done) {
                break;
            }

            state = next_state;
        }
        // reward_plotting[i] = (reward_plotting[i]/(episode_length+1))*100;
        // await serialiser.serialise({
        //     reward_plotting: reward_plotting,
        // }, 'plot_actor_critic.json');
        // if(i%10) {
        // agent.actor.save(__dirname+'/actor_model');
        // agent.critic.save(__dirname+'/critic_model');
        // }
    // }

    // return Promise.resolve({
    //     reward_plotting: reward_plotting,
    // });
}