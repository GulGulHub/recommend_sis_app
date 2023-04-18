
  console.log("JS has started");
    let favorite_all = document.getElementById("favorite_sisters");
    let allData = localStorage.getItem("allData");
    if (allData) {
      for (let sister in allData) {
        console.log(typeof allData)
      }
      favorite_all.innerHTML = allData;

    }
 