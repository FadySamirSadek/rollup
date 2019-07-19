const assert = require('assert');
let referenceId;

module.exports = {
	description: 'supports specifying a file name when emitting a chunk',
	options: {
		input: 'main',
		plugins: {
			buildStart() {
				referenceId = this.emitFile({
					type: 'chunk',
					id: 'buildStart',
					fileName: 'custom/build-start-chunk.js'
				});
			},
			renderChunk() {
				assert.strictEqual(this.getFileName(referenceId), 'custom/build-start-chunk.js');
			}
		}
	}
};
