const firstWordleDate = new Date(2021, 5, 19, 0, 0, 0, 0);
const numOfMsInDay = 24 * 60 * 60 * 1000;
const getDayOffset = (d1, d2) => {
  const date1 = new Date(d1);
  const msBetweenMidnightsLocalTime = new Date(d2).setHours(0,0,0,0) - date1.setHours(0,0,0,0);
  return Math.round(msBetweenMidnightsLocalTime / numOfMsInDay);
};

document.getElementById('dayNumInput').value = getDayOffset(firstWordleDate, new Date());

// When the button is clicked, set local storage and refresh
// so background script chooses appropriate level
document.getElementById('catchupButton').addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: updateDay,
    args: [document.getElementById('dayNumInput').value]
  });
});

function updateDay(dayNum) {
	const firstWordleDate = new Date(2021, 5, 19, 0, 0, 0, 0);
  const numOfMsInDay = 24 * 60 * 60 * 1000;
	const d = new Date(firstWordleDate.valueOf() + (numOfMsInDay)*dayNum);
	localStorage.setItem('lastPlayedTs', d);
	localStorage.setItem('lastCompletedTs', d);
	history.go(0);
}