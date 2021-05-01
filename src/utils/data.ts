const getAudioURL = (data: MusicMetadataWithID) => {
  return `${process.env.API_SERVER}/audio/${data.id}`
}

export default {
  getAudioURL
}
