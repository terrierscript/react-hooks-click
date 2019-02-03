import fetchJsonp from "fetch-jsonp"
import qs from "querystring"

//: Promise<string[] | undefined>
export const searchApi = (word) => {
  const baseURL = "https://ja.wikipedia.org/w/api.php"
  const params = {
    action: "opensearch",
    format: "json",
    search: word
  }
  const url = `${baseURL}?${qs.stringify(params)}`
  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res(["a", "b", "c"])
  //   }, 500)
  // })
  return fetchJsonp(url)
    .then((response) => response.json())
    .then((json) => json[1])
}
