define(["./FileStorageProvider"],
function(FileStorageProvider) {
	var service = new FileStorageProvider();

	return {
		initialize: function(registry) {
			registry.register({
				interfaces: 'tantaman.web.StorageProvider'
			}, service);
		}
	};
});