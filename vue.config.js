module.exports = {
	chainWebpack: (config) => {
		config.plugin("html").tap((args) => {
			args[0].title = "Issue Tracker Hzs";
			return args;
		});
	},
	publicPath: "./",
	devServer: {
		proxy: 'https://console.firebase.google.com/u/0/project/hzs-issue-tracker/',
	}
};
