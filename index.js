async function fetchUserActivity(username){
    const response= await fetch(
        `https://api.github.com/users/${username}/events`,
        {
            headers:{
                "user-Agent": "node.js"
            }
        }
    )
    if(!response.ok){
        if (response.status === 404) {
            throw new Error("User not found. Please check the username.");
          } else {
            throw new Error(`Error fetching data: ${response.status}`);
          }
    }
    return response.json()
}
function displayActivity(events) {
    if (events.length === 0) {
        console.log("No recent activity found.");
        return;
    }

    const uniqueEvents = [];
    const seen = new Set();

    events.forEach((event) => {
        const identifier = `${event.type}-${event.repo.name}-${event.created_at}`;
        if (!seen.has(identifier)) {
            seen.add(identifier);
            uniqueEvents.push(event);
        }
    });

    uniqueEvents.forEach((event) => {
        const action = `${event.type} in ${event.repo.name} at ${event.created_at}`;
        console.log(`- ${action}`);
    });
}

  const username= process.argv[2]
  if(!username){
    console.log('there is no username')
    process.exit(1)
  }
  fetchUserActivity(username).then((events)=>{
    displayActivity(events)
  }).catch((err)=>{
    console.log(err.message)
    process.exit(1)
  })