import axios from "axios";
const API_KEY = process.env.SEARCH_API;

const searchImage = async (searchTerm: string) => {
  try {
    const response = await axios.get(
      `https://customsearch.googleapis.com/customsearch/v1?cx=534a34b9f034a47a9&exactTerms=${searchTerm}&safe=active&searchType=image&key=AIzaSyB5FV37qeu5aQ6pZHDKyiOwF26U4Puq5yw`
    );
    return response.data.items[0].link;
  } catch (error: any) {
    return "";
  }
};

export default searchImage;
