"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodeList = $("#episodesList");
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const shows = [];
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);

  // iterate thru data received
  res.data.forEach((data) => {
    // push wanted data to shows variable
    shows.push({
      id: data.show.id,
      name: data.show.name,
      summary: data.show.summary,
      // check if image exist, if it does add it to arr or add default image
      image: data.show.image.original
        ? data.show.image.original
        : "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300",
    });
  });
  // return all shows with filter data
  return shows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  console.log(shows);
  $showsList.empty();

  // iterate thru shows
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3 card-img-top">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" id=${show.id}>
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
// get id when clickd

$("#showsList").on("click", ".Show .Show-getEpisodes", function (e) {
  // call getEpisodes with the id of button clicked
  getEpisodesOfShow(e.target.id);
});

async function getEpisodesOfShow(id) {
  let episodesData = [];
  // get episodes bast on show id
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  // iterate thru response
  res.data.forEach((data) => {
    // push it to episode data
    episodesData.push({
      id: data.id,
      name: data.name,
      season: data.season,
      number: data.number,
    });
  });
  populateEpisodes(episodesData);
  // clear data if click again
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  // show episode area
  $episodesArea.show();
  // empty current episodes shown
  $episodeList.empty();
  // append to episodes
  episodes.forEach((episode) => {
    $episodeList.append(
      `<li>${episode.name}(season ${episode.season}), number ${episode.number}</li>`
    );
  });
}
