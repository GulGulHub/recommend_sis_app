window.onload = function() {
    let favorite_all = document.getElementById("favorite_sisters");
    let allData = localStorage.getItem("allData");
    if (allData) {
      favorite_all.innerText = allData;
      localStorage.removeItem("allData"); // Optional: remove the stored data after use
    }
  };