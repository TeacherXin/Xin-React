import { Props, Key, Ref } from 'share/ReactType';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './filberFlags';

export class FilberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	type: any;

	return: FilberNode | null;
	sibling: FilberNode | null;
	child: FilberNode | null;
	index: number;

	ref: Ref;

	pendingProps: Props;
	memoizedProps: Props | null;

	alternate: FilberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.alternate = null;

		this.flags = NoFlags;
	}
}
