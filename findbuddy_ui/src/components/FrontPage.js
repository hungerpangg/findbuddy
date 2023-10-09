import FrontPageHome from "./FrontPageHome";

function FrontPage() {
	return (
		<div>
			<div
				style={{
					margin: "2em auto",
					// backgroundColor: "red",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<h3 style={{ textAlign: "center", margin: "0 auto" }}>
					The buddies platform - where interests become friendships{" "}
				</h3>
				<div style={{ margin: "1em 1em" }}>
					You want to try a Muay Thai class, but you can't find friends to go
					with. You want to head to the club, but your clique is not available.
					You want to travel to Thailand, but your travel buddies have clashing
					schedules. FindBuddy is a platform where you can search and find
					like-minded people with similar interests and values, or meet
					different people altogether. If you want new buddies to do things
					with, what are you waiting for?
				</div>
				<img
					style={{ objectFit: "cover", height: "300px", width: "440px" }}
					src="https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/findbuddy-home.jpg"
				></img>
			</div>
			<div>
				<div style={{ margin: "1em 1em", textAlign: "center" }}>
					Search for people who have similar interests or hobbies as you!
				</div>
			</div>
			<div>
				<FrontPageHome />
			</div>
		</div>
	);
}

export default FrontPage;
