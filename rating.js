window.LimoGoRating = {
  async submitRating(rideId, rating, review = "") {
    console.info("Rating submitted:", { rideId, rating, review });
    return { ok: true, rideId, rating, review };
  }
};
