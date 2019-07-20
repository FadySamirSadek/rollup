module.exports = {
	description: 'deconflicts files against named files',
	options: {
		input: 'main',
		output: { assetFileNames: '[name].js', chunkFileNames: '[name].js' },
		plugins: {
			buildStart() {
				this.emitFile({
					type: 'chunk',
					id: 'emitted1',
					name: 'myfile'
				});
				this.emitFile({
					type: 'chunk',
					id: 'emitted2',
					fileName: 'myfile.js'
				});
				this.emitFile({
					type: 'chunk',
					id: 'emitted3',
					name: 'myfile'
				});
				this.emitFile({
					type: 'asset',
					name: 'myfile.js',
					source: 'text1'
				});
			},
			renderStart() {
				this.emitFile({
					type: 'asset',
					name: 'myfile.js',
					source: 'text2'
				});
			}
		}
	}
};
