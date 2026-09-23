window.LimoGoPages = {
  async loadProfile(user) {
    return {
      id: user?.id || "demo-user",
      full_name: user?.user_metadata?.full_name || "Khách hàng",
      email: user?.email || "customer@example.com",
      wallet_balance: 250000,
      reward_points: 1240,
      membership: "Green Member"
    };
  },

  async updateWalletBalance() {
    return 250000;
  },

  async addRewardPoints() {
    return 1240;
  }
};
