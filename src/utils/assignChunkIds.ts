import Chunk from '../Chunk';
import { InputOptions, OutputBundleWithPlaceholders, OutputOptions } from '../rollup/types';
import { Addons } from './addons';
import { FILE_PLACEHOLDER } from './FileEmitter';
import { basename } from './path';

export function assignChunkIds(
	chunks: Chunk[],
	inputOptions: InputOptions,
	outputOptions: OutputOptions,
	inputBase: string,
	addons: Addons,
	bundle: OutputBundleWithPlaceholders
) {
	const [entryChunks, otherChunks] = chunks.reduce<[Chunk[], Chunk[]]>(
		([entryChunks, otherChunks], chunk) => {
			(chunk.facadeModule && chunk.facadeModule.isUserDefinedEntryPoint
				? entryChunks
				: otherChunks
			).push(chunk);
			return [entryChunks, otherChunks];
		},
		[[], []]
	);

	// make sure entry chunk names take precedence with regard to deconflicting
	const chunksForNaming: Chunk[] = entryChunks.concat(otherChunks);
	for (let i = 0; i < chunksForNaming.length; i++) {
		const chunk = chunksForNaming[i];
		const facadeModule = chunk.facadeModule;

		if (outputOptions.file) {
			chunk.id = basename(outputOptions.file);
		} else if (inputOptions.preserveModules) {
			chunk.id = chunk.generateIdPreserveModules(inputBase, bundle);
		} else if (facadeModule && facadeModule.chunkFileName) {
			chunk.id = facadeModule.chunkFileName;
		} else {
			let pattern, patternName;
			if (facadeModule && facadeModule.isUserDefinedEntryPoint) {
				pattern = outputOptions.entryFileNames || '[name].js';
				patternName = 'output.entryFileNames';
			} else {
				pattern = outputOptions.chunkFileNames || '[name]-[hash].js';
				patternName = 'output.chunkFileNames';
			}
			chunk.id = chunk.generateId(pattern, patternName, addons, outputOptions, bundle);
		}
		bundle[chunk.id] = FILE_PLACEHOLDER;
	}
}
