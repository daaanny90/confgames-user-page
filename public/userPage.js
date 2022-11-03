import firebaseConfig from "./user_page_firebase_credentials.js"
import "./components/station.js"
import "./components/prize.js"

import {
  initializeApp,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js"

import {
  getFirestore,
  doc,
  getDocs,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js"

/**
 * The station object
 * @typedef {Object} Station
 * @property {string} name - The station name
 * @property {string} logo - The station logo
 */

/**
 * The prize object
 * @typedef {Object} Prize
 * @property {string} id - The prize name
 * @property {string} image.title - The prize image title
 * @property {string} image.url - The prize image url
 * @property {string} name - The prize name
 */

export default class UserPage {
  /**
   * Instantiate the user page
   * @param {string} userId
   * @param {HTMLElement} nickname The HTML element where the nickname will be rendered
   * @param {HTMLElement} priceWon The HTML element where the won price will be rendered
   * @param {HTMLElement} playedStations The HTML element where the played stations will be rendered 
   * @param {HTMLElement} notPlayedStations The HTML element where all the statiosn will be rendered  
   */
  constructor(userId, nickname, priceWon, playedStations, notPlayedStations) {
    /**
     * @type {string}
     */
    this.nickname = ""
    /**
     * @type {HTMLElement}
     */
    this.nicknameElement = nickname
    /**
     * @type {Array<Station>}
     */
    this.allStations = []
    /**
     * @type {Array<string>}
     */
    this.playedStations = []
    /**
     * @type {HTMLElement}
     */
    this.playedStationsElement = playedStations
    /**
     * @type {HTMLElement}
     */
    this.notPlayedStationsElement = notPlayedStations
    /**
     * @type {Prize | null}
     */
    this.priceWon = null
    /**
     * @type {HTMLElement}
     */
    this.priceWonElement = priceWon
    /**
     * @type {string}
     */
    this.userId = userId

    this.firebaseApp = initializeApp(firebaseConfig)

    this.renderData()
  }

  /**
   * Connect to Firestore and get data from Profile document
   * - User nickname
   * - Played stations
   * - Prize won
   * 
   * @return void
   */
  async bindToProfileDocument() {
    const firestore = getFirestore(this.firebaseApp)
    const profileDocumentRef = await doc(firestore, "profiles", this.userId)
    onSnapshot(profileDocumentRef, (async (snapshot) => {
      if (!snapshot.exists) {
        console.error("cannot listen to none existing document")
        return
      }

      const profileDocument = await snapshot.data()

      this.playedStations = profileDocument.playedStations
      this.priceWon = profileDocument.priceWon

      this.nicknameElement.textContent = profileDocument.nickname
    }))
  }

  /**
   * Connect to firestore and get data from Station document
   * - all stations list
   * 
   * @return {void}
   */
  async bindToStationDocument() {
    const firestore = getFirestore(this.firebaseApp)
    const stationsCollection = await getDocs(collection(firestore, "stations"))
    stationsCollection.forEach((station) => {
      const doc = station.data()

      this.allStations.push({
        name: doc.name,
        logo: doc.logo.url
      })
    })
  }

  /**
   * Get all the needed data from firestore and populate the frontend
   * 
   * @return {void}
   */
  async renderData() {
    await this.bindToProfileDocument()
    await this.bindToStationDocument()

    this.renderStations(this.notPlayedStationsElement, "notPlayed")
    this.renderStations(this.playedStationsElement, "played")
    this.renderPrize()
  }

  /**
   * Populate the frontend with stations based on type
   * 
   * @param {HTMLElemen} element The HTML element where the stations must be rendered
   * @param {"played" | "notPlayed"} type The type of station, can be "played" or "notPlayed"
   * 
   * @return {void}
   */
  renderStations(element, type = "notPlayed") {
    element.innerHTML = ""
    let stations = []

    if (type === "notPlayed") {
      stations = this.allStations.filter(station => !this.playedStations.includes(station.name))
    }

    if (type === "played") {
      stations = this.allStations.filter(station => this.playedStations.includes(station.name))
    }

    stations.forEach((station) => {
      const stationComponent = document.createElement("cg-station")
      element.appendChild(stationComponent)

      stationComponent.setStationName(station.name)
      stationComponent.setStationImage(station.logo)

      if (type === "played") {
        stationComponent.setStationAsPlayed()
      }
    }) 
  }

  /**
   * Render the won prize
   */
  renderPrize() {
    /**
     * @type {Prize}
     */
    const prizeComponent = document.createElement("cg-prize")
    this.priceWonElement.innerHTML = ""
    this.priceWonElement.appendChild(prizeComponent)

    if (this.priceWon) {
      prizeComponent.setPrizeName(this.priceWon.name)
      prizeComponent.setPrizeImage(this.priceWon.image.url)
      return
    }
    
    prizeComponent.noPrize()
  }
}

/**
 * Generate the user ID from the give parameter in url
 * @todo this is a mock function, the goal is to call an end point with the parameter that gives back the user ID. This is only for dev-test purposes
 * 
 * @param {string} param the parameter in the url
 * @return {string} The user ID
 */
export function getUserIdFromParameter(param) {
  const userWithoutPrize = "1237fcb4a8bfb58f542e9a0c348b664a"
  const userWithPrize = "818ff212b7e3fb3dab585ac352799f7a" 
  param = userWithPrize
  return param
}