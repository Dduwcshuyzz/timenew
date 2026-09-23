window.LimoGoPayments = {
  async savePayment(rideId, amount, method, status = "completed") {
    console.info("Saved payment:", { rideId, amount, method, status });
    return { ok: true, rideId, amount, method, status };
  },

  async addRewardPoints(userId, points) {
    console.info("Added reward points:", { userId, points });
    return { ok: true, userId, points };
  }
};
