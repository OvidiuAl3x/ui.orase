// Set focus on the search input when the window loads
window.onload = function () {
  document.getElementById("searchInput").focus();
};

// Define regular expressions for special characters
const aREG = new RegExp("ș", "g");
const bREG = new RegExp("ț", "g");
const cREG = new RegExp("â", "g");
const dREG = new RegExp("ă", "g");
const eREG = new RegExp("î", "g");

// Fetch data from the API and initiate the search
async function fetchData() {
  try {
    const response = await fetch(`https://orase.peviitor.ro/`);
    const data = await response.json();
    performSearch(data);
    renderDropdown(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Trigger data fetching on page load
fetchData();

const searchInput = document.getElementById("searchInput");
const dropDownTemplate = document.querySelector("[dropDown-template]");
const dropDownContainer = document.querySelector("[dropDown-container]");

// Function to render the dropdown menu based on the search results
function renderDropdown(data) {
  let originalData;

  // Event listener for the search input click
  searchInput.addEventListener("click", () => {
    if (!searchInput.value.trim()) {
      dropDownContainer.classList.add("searchResults-display");
      dropDownContainer.innerHTML = "";
      dropDownContainer.scrollTop = 0;

      originalData = [...data.judet, data.municipiu];
      originalData.sort((a, b) => a.nume.localeCompare(b.nume));

      renderDropdown(originalData);
    }
  });

  function displaySelectedData(selectedItem) {
    const resultArray = new Set();

    dropDownContainer.scrollTop = 0;

    if (selectedItem.sector) {
      const sectorResult = selectedItem.sector;
      if (sectorResult != null) {
        for (const items of sectorResult) {
          resultArray.add(items.nume);
        }
      }
    }

    if (selectedItem.municipiu) {
      const municipiuResult = selectedItem.municipiu;
      if (municipiuResult != null) {
        municipiuResult.forEach((item) => {
          resultArray.add(item.nume);
          for (const items of item.localitate) {
            resultArray.add(items.nume);
            if (items.localitate != null) {
              for (const nestedData of items.localitate) {
                resultArray.add(nestedData.nume);
              }
            }
          }
        });
      }
    }

    if (selectedItem.oras) {
      const orasResult = selectedItem.oras;
      if (orasResult != null) {
        orasResult.forEach((item) => {
          resultArray.add(item.nume);
          for (const items of item.localitate) {
            resultArray.add(items.nume);
            if (items.localitate != null) {
              for (const nestedData of items.localitate) {
                resultArray.add(nestedData.nume);
              }
            }
          }
        });
      }
    }

    if (selectedItem.comuna) {
      const comunaResult = selectedItem.comuna;
      if (comunaResult != null) {
        comunaResult.forEach((item) => {
          resultArray.add(item.nume);
          for (const items of item.localitate) {
            resultArray.add(items.nume);
            if (items.localitate != null) {
              for (const nestedData of items.localitate) {
                resultArray.add(nestedData.nume);
              }
            }
          }
        });
      }
    }

    dropDownContainer.innerHTML = "";

    renderBackButton(originalData);
    renderLocationDetails(selectedItem);
    renderChooseLocationText();
    uniqueArray(resultArray, selectedItem);
  }

  function renderBackButton(originalData) {
    const divButton = document.createElement("div");
    const backButton = document.createElement("p");
    const imageButton = document.createElement("img");
    divButton.classList.add("div-back-button");
    backButton.classList.add("back-button");
    imageButton.classList.add("arrow-image");
    imageButton.src = "./icons/right-arrow.png";
    imageButton.alt = "icon-arrow";
    backButton.innerText = "Inapoi";
    divButton.addEventListener("click", () => {
      renderDropdown(originalData);
    });

    divButton.appendChild(imageButton);
    divButton.appendChild(backButton);
    dropDownContainer.appendChild(divButton);
  }

  function renderLocationDetails(selectedItem) {
    const totJudetul = document.createElement("div");
    totJudetul.classList.add("tot-judetul");
    totJudetul.innerHTML = `<p>${selectedItem.nume}</p>  <span>Tot județul</span>`;
    dropDownContainer.appendChild(totJudetul);
    totJudetul.addEventListener("click", function () {
      dropDownContainer.classList.remove("searchResults-display");
      searchInput.value = selectedItem.nume;
    });
  }

  function renderChooseLocationText() {
    const alegeLocatie = document.createElement("p");
    alegeLocatie.classList.add("alege-locatie");
    alegeLocatie.innerText = "Alege localitatea";
    dropDownContainer.appendChild(alegeLocatie);
  }

  function uniqueArray(resultArray, selectedItem) {
    const uniqueArray = Array.from(resultArray);
    uniqueArray.sort((a, b) => a.localeCompare(b));
    uniqueArray.forEach((item) => {
      const card = dropDownTemplate.content.cloneNode(true).children[0];
      const dataJudet = card.querySelector("[dropDown-afisare]");
      dataJudet.innerHTML = item;

      // show results in input
      card.addEventListener("click", () => {
        const resultJudet = selectedItem.nume;

        dropDownContainer.classList.remove("searchResults-display");
        searchInput.value = `${item}, ${resultJudet}`;

        const inputWidth = searchInput.value.length * 9;
        searchInput.style.width = `${inputWidth}px`;
      });

      dropDownContainer.appendChild(card);
    });
  }

  function renderDropdown(data) {
    dropDownContainer.innerHTML = "";

    const alegeLocatie = document.createElement("p");
    alegeLocatie.classList.add("alege-locatie");
    alegeLocatie.innerText = "Alege un judet";
    dropDownContainer.appendChild(alegeLocatie);

    data.forEach((item) => {
      const card = dropDownTemplate.content.cloneNode(true).children[0];
      const dataJudet = card.querySelector("[dropDown-afisare]");
      const dropDownImage = card.querySelector("[dropDown-image]");
      dataJudet.innerHTML = item.nume;
      dropDownImage.src = "./icons/right-arrow.png";
      dropDownImage.alt = "arrow-icon";
      dropDownContainer.appendChild(card);
      card.addEventListener("click", () => {
        displaySelectedData(item);
      });
    });
  }
}

// Function to close the dropdown when clicking outside
function closeDropdownOnClickOutside(event) {
  const dropdownContainer = document.querySelector("[dropDown-container]");
  const searchInput = document.getElementById("searchInput");

  if (
    !dropdownContainer.contains(event.target) &&
    event.target !== searchInput &&
    !searchInput.contains(event.target)
  ) {
    dropdownContainer.classList.remove("searchResults-display");
  }
}

// Event listener to close dropdown on click outside
window.addEventListener("click", closeDropdownOnClickOutside);

// Event listener to prevent closing when clicking inside the dropdown
document
  .querySelector("[dropDown-container]")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

// Function to validate input using regular expression
function validateInput(input) {
  const regex = /^[a-zA-ZșțâăîÎȚȘÂĂ0-9\s-.,]+$/;
  const invalidInput = document.querySelector(".errors");
  const search = document.querySelector(".search");

  if (!regex.test(input.value) && input.value.trim() !== "") {
    // If input contains invalid characters, clear and display error
    input.value = input.value.replace(/[^a-zA-ZșțâăîÎÂȚȘĂ0-9\s-.,]/g, "");
    invalidInput.style.display = "block";
    search.style.border = "1px solid red";
    setTimeout(function () {
      invalidInput.style.display = "none";
      search.style.border = "1px solid black";
    }, 2000);
  }
}

// Function to handle search functionality
function performSearch(data) {
  const cardTemplate = document.querySelector("[data-template]");
  const cardContainer = document.querySelector("[data-container]");

  searchInput.addEventListener("input", function () {
    dropDownContainer.classList.remove("searchResults-display");
    validateInput(searchInput);

    const searchedVal = searchInput.value.trim().toLowerCase();

    if (searchedVal.length >= 2) {
      const searchResult = searchLocation(searchedVal, data.judet);
      const searchResultBucuresti = searchMunicipiu(
        searchedVal,
        data.municipiu
      );

      if (searchResult || searchResultBucuresti) {
        const uniqueResults = removeDuplicates(searchResult);
        displayResults(uniqueResults, searchResultBucuresti);
      } else {
        displayResults([]);
      }
    } else {
      cardContainer.classList.add("searchResults-display");
      cardContainer.innerHTML =
        "<p>Introdu minim 2 litere ca sa poata functiona searchul</p>";
    }

    if (searchedVal.length < 1) {
      searchInput.style.width = "auto";
      cardContainer.classList.remove("searchResults-display");
      cardContainer.innerHTML = "";
    }
  });

  function displayResults(results, resultsBucuresti) {
    cardContainer.innerHTML = "";

    if (
      (results && results.length > 0) ||
      (resultsBucuresti && resultsBucuresti.length > 0)
    ) {
      // Custom sorting function based on the closeness of the match to the beginning
      const customSort = (a, b) => {
        const aIsTopResult = a.parent === null && a.judet === null;
        const bIsTopResult = b.parent === null && b.judet === null;

        if (aIsTopResult === bIsTopResult) {
          const searchTerm = searchInput.value.trim().toLowerCase();

          const aIndex =
            a.query.toLowerCase().indexOf(searchTerm) &&
            a.query
              .toLowerCase()
              .replace(aREG, "s")
              .replace(bREG, "t")
              .replace(cREG, "a")
              .replace(dREG, "a")
              .indexOf(searchTerm);
          const bIndex =
            b.query.toLowerCase().indexOf(searchTerm) &&
            b.query
              .toLowerCase()
              .replace(aREG, "s")
              .replace(bREG, "t")
              .replace(cREG, "a")
              .replace(dREG, "a")
              .indexOf(searchTerm);

          if (aIndex !== -1 && bIndex !== -1) {
            return (
              aIndex - bIndex ||
              a.query.toLowerCase().localeCompare(b.query.toLowerCase())
            );
          }

          if (aIndex !== -1) {
            return -1;
          }
          if (bIndex !== -1) {
            return 1;
          }

          // Change comparison here for ascending order
          const judetComparison = a.judet.localeCompare(b.judet);
          // Reverse the comparison result
          if (judetComparison !== 0) {
            return judetComparison;
          }

          return a.query.localeCompare(b.query);
        }

        return aIsTopResult ? -1 : 1;
      };

      // Sort the results array using the custom sort function
      const sortedResults = results.sort(customSort);
      // Display Bucuresti results
      if (resultsBucuresti) {
        resultsBucuresti.forEach((result) => {
          const card = cardTemplate.content.cloneNode(true).children[0];
          const dataQuery = card.querySelector("[data-query]");
          const dataParent = card.querySelector("[data-parent]");

          dataQuery.textContent = result.parent
            ? result.query + ","
            : result.query;
          dataParent.textContent = result.parent;

          cardContainer.appendChild(card);
        });
      }
      // Display judete results
      if (results) {
        sortedResults.forEach((result) => {
          const card = cardTemplate.content.cloneNode(true).children[0];
          const dataQuery = card.querySelector("[data-query]");
          const dataParent = card.querySelector("[data-parent]");
          const dataJudet = card.querySelector("[data-judet]");

          if (result.judet !== null) {
            dataQuery.innerHTML = `<strong style="text-transform:capitalize">${
              result.locationParent !== null
                ? result.locationParent
                : result.tip !== null
                ? result.tip.includes("sat")
                  ? "Sat"
                  : "Oraș"
                : ""
            }</strong> ${result.query}, `;

            dataJudet.innerHTML = `<strong>${result.judet}</strong>`;
            dataParent.textContent = `${
              result.tip != null ? `(${result.parent})` : ""
            }`;
          } else {
            dataQuery.innerHTML = `${
              "<strong>Județul</strong> " + result.query
            }`;
          }

          // Add an event listener to the search results container
          card.addEventListener("click", function () {
            cardContainer.classList.remove("searchResults-display");
            cardContainer.innerHTML = "";

            let inputValue;

            const location =
              result.locationParent !== null
                ? result.locationParent
                : result.tip !== null
                ? result.tip.includes("sat")
                  ? "Sat"
                  : "Oraș"
                : "";

            const capitalizedLocation =
              location.charAt(0).toUpperCase() +
              location.slice(1).toLowerCase();
            const query = result.query;

            if (result.judet !== null) {
              const tip =
                result.parent !== result.judet ? "(" + result.parent + ")" : "";
              inputValue = `${capitalizedLocation} ${query}, ${result.judet} ${tip}`;
            } else {
              inputValue = `Județul ${query}`;
            }

            searchInput.value = inputValue;

            const inputWidth = inputValue.length * 9;
            searchInput.style.width = `${inputWidth}px`;
          });
          cardContainer.appendChild(card);
        });
      }
    } else {
      const p = document.createElement("p");
      p.textContent = "Locatia nu a fost gasita!";
      cardContainer.appendChild(p);
    }

    cardContainer.classList.add("searchResults-display");
  }

  function searchMunicipiu(query, locations) {
    let matchingLocations = [];

    const filtre =
      locations.nume.toLowerCase().replace(aREG, "s").includes(query) ||
      locations.nume.toLowerCase().includes(query);

    if (filtre) {
      const result = {
        query: locations.nume,
      };
      matchingLocations.push(result);
    }

    for (const sector of locations.sector) {
      if (sector.nume.toLowerCase().includes(query)) {
        matchingLocations.push({
          query: sector.nume,
          parent: locations.nume,
        });
      }
    }
    return matchingLocations.length > 0 ? matchingLocations : null;
  }

  function searchLocation(
    query,
    locations,
    parentJudetName = null,
    parentName = null,
    locationParent = null
  ) {
    let matchingLocations = [];

    for (const location of locations) {
      const judetName = location.nume ? location.nume : parentJudetName;

      const queryForComparison = query.replace(/\s/g, "-");
      const filtre =
        judetName
          .toLowerCase()
          .replace(aREG, "s")
          .replace(bREG, "t")
          .replace(cREG, "a")
          .replace(dREG, "a")
          .replace(eREG, "i")
          .includes(query) ||
        judetName.toLowerCase().includes(query) ||
        judetName
          .toLowerCase()
          .replace(aREG, "s")
          .replace(bREG, "t")
          .replace(cREG, "a")
          .replace(dREG, "a")
          .replace(eREG, "i")
          .includes(queryForComparison.toLowerCase());

      if (filtre) {
        const result = {
          query: location.nume,
          judet: parentName,
          parent: parentJudetName,
          tip: location.tip || null,
          locationParent,
        };
        matchingLocations.push(result);
      }

      // Recursively search in municipality, city, and commune levels
      if (location.municipiu) {
        const municipiuResult = searchLocation(
          query,
          location.municipiu,
          location.nume,
          judetName,
          "Municipiul"
        );
        if (municipiuResult != null) {
          matchingLocations.push(
            ...municipiuResult.filter((result) => result !== null)
          );
        }

        for (const municipiuLocation of location.municipiu) {
          const localitateResult = searchLocation(
            query,
            municipiuLocation.localitate,
            municipiuLocation.nume,
            judetName
          );

          if (localitateResult != null) {
            matchingLocations.push(
              ...localitateResult.filter((result) => result !== null)
            );
          }

          for (const nestedLocalitate of municipiuLocation.localitate) {
            const nestedLocalitateResults = searchLocation(
              query,
              [nestedLocalitate],
              municipiuLocation.nume,
              judetName
            );

            if (nestedLocalitateResults != null) {
              matchingLocations.push(
                ...nestedLocalitateResults.filter((result) => result !== null)
              );
            }
            if (nestedLocalitate.localitate != undefined) {
              for (const nestedLocalitate2 of nestedLocalitate.localitate) {
                const nestedLocalitateResults2 = searchLocation(
                  query,
                  [nestedLocalitate2],
                  municipiuLocation.nume,
                  judetName
                );
                if (nestedLocalitateResults2 != null) {
                  matchingLocations.push(
                    ...nestedLocalitateResults2.filter(
                      (result) => result !== null
                    )
                  );
                }
              }
            }
          }
        }
      }

      if (location.oras) {
        const orasResult = searchLocation(
          query,
          location.oras,
          location.nume,
          judetName,
          "Oraș"
        );

        if (orasResult != null) {
          matchingLocations.push(
            ...orasResult.filter((result) => result !== null)
          );
        }

        for (const orasLocation of location.oras) {
          const localitateResult = searchLocation(
            query,
            orasLocation.localitate,
            orasLocation.nume,
            judetName
          );

          if (localitateResult != null) {
            matchingLocations.push(
              ...localitateResult.filter((result) => result !== null)
            );
          }

          for (const nestedLocalitate of orasLocation.localitate) {
            const nestedLocalitateResults = searchLocation(
              query,
              [nestedLocalitate],
              orasLocation.nume,
              judetName
            );
            if (nestedLocalitateResults != null) {
              matchingLocations.push(
                ...nestedLocalitateResults.filter((result) => result !== null)
              );
            }
            if (nestedLocalitate.localitate != undefined) {
              for (const nestedLocalitate2 of nestedLocalitate.localitate) {
                const nestedLocalitateResults2 = searchLocation(
                  query,
                  [nestedLocalitate2],
                  orasLocation.nume,
                  judetName
                );
                if (nestedLocalitateResults2 != null) {
                  matchingLocations.push(
                    ...nestedLocalitateResults2.filter(
                      (result) => result !== null
                    )
                  );
                }
              }
            }
          }
        }
      }

      if (location.comuna) {
        const comunaResult = searchLocation(
          query,
          location.comuna,
          location.nume,
          judetName,
          "Comuna"
        );
        if (comunaResult != null) {
          matchingLocations.push(
            ...comunaResult.filter((result) => result !== null)
          );
        }

        for (const comunaLocation of location.comuna) {
          const localitateResult = searchLocation(
            query,
            comunaLocation.localitate,
            comunaLocation.nume,
            judetName
          );

          if (localitateResult != null) {
            matchingLocations.push(
              ...localitateResult.filter((result) => result !== null)
            );
          }

          for (const nestedLocalitate of comunaLocation.localitate) {
            const nestedLocalitateResults = searchLocation(
              query,
              [nestedLocalitate],
              comunaLocation.nume,
              judetName
            );
            if (nestedLocalitateResults != null) {
              matchingLocations.push(
                ...nestedLocalitateResults.filter((result) => result !== null)
              );
            }
            if (nestedLocalitate.localitate != undefined) {
              for (const nestedLocalitate2 of nestedLocalitate.localitate) {
                const nestedLocalitateResults2 = searchLocation(
                  query,
                  [nestedLocalitate2],
                  comunaLocation.nume,
                  judetName
                );
                if (nestedLocalitateResults2 != null) {
                  matchingLocations.push(
                    ...nestedLocalitateResults2.filter(
                      (result) => result !== null
                    )
                  );
                }
              }
            }
          }
        }
      }
    }
    return matchingLocations.length > 0 ? matchingLocations : null;
  }

  // Function to remove duplicates based on judet, parent
  function removeDuplicates(results) {
    const uniqueResults = [];
    const seenResults = new Set();

    if (results != null) {
      for (const result of results) {
        const { judet, parent, query, locationParent } = result;

        if (query != undefined) {
          const key = `${judet}-${parent}-${query}-${locationParent}`;
          if (!seenResults.has(key)) {
            seenResults.add(key);
            uniqueResults.push(result);
          }
        }
      }
    }

    return uniqueResults;
  }
}

// Event listener for the delete icon to clear the search input
const deleteIcon = document.querySelector(".delete-icon");
deleteIcon.addEventListener("click", () => {
  document.querySelector("#searchInput").style.width = "auto";
  document.querySelector("#searchInput").value = "";
  document.querySelector(".searchResults").innerHTML = "";
  document
    .querySelector(".searchResults")
    .classList.remove("searchResults-display");
});
