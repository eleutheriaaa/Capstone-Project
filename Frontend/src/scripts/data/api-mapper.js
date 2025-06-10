import Map from '../utils/map';

export async function storyMapper(story) {
  const lat = story.lat ?? 0;
  const lon = story.lon ?? 0;

  return {
    ...story,
    location: {
      latitude: lat,
      longitude: lon,
      placeName: await Map.getPlaceNameByCoordinate(lat, lon),
    },
  };
}
