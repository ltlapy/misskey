<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkSpacer :contentMax="700">
	<div>
		<div class="_gaps_m">
			<MkInput v-model="name">
				<template #label>{{ i18n.ts.name }}</template>
			</MkInput>
			<MkSelect v-model="src">
				<template #label>{{ i18n.ts.antennaSource }}</template>
				<option value="all">{{ i18n.ts._antennaSources.all }}</option>
				<!--<option value="home">{{ i18n.ts._antennaSources.homeTimeline }}</option>-->
				<option value="users">{{ i18n.ts._antennaSources.users }}</option>
				<!--<option value="list">{{ i18n.ts._antennaSources.userList }}</option>-->
				<!--<option value="group">{{ i18n.ts._antennaSources.userGroup }}</option>-->
				<option value="users_blacklist">{{ i18n.ts._antennaSources.userBlacklist }}</option>
			</MkSelect>
			<MkSelect v-if="src === 'list'" v-model="userListId">
				<template #label>{{ i18n.ts.userList }}</template>
				<option v-for="list in userLists" :key="list.id" :value="list.id">{{ list.name }}</option>
			</MkSelect>
			<MkSelect v-else-if="src === 'group'" v-model="userGroupId">
				<template #label>{{ i18n.ts.groups }}</template>
				<option v-for="group in userGroups" :key="group.id" :value="group.id">{{ group.name }}</option>
			</MkSelect>
			<MkTextarea v-else-if="src === 'users' || src === 'users_blacklist'" v-model="users">
				<template #label>{{ i18n.ts.users }}</template>
				<template #caption>{{ i18n.ts.antennaUsersDescription }} <button class="_textButton" @click="addUser">{{ i18n.ts.addUser }}</button></template>
			</MkTextarea>
			<MkSwitch v-model="withReplies">{{ i18n.ts.withReplies }}</MkSwitch>
			<MkTextarea v-model="keywords">
				<template #label>{{ i18n.ts.antennaKeywords }}</template>
				<template #caption>{{ i18n.ts.antennaKeywordsDescription }}</template>
			</MkTextarea>
			<MkTextarea v-model="excludeKeywords">
				<template #label>{{ i18n.ts.antennaExcludeKeywords }}</template>
				<template #caption>{{ i18n.ts.antennaKeywordsDescription }}</template>
			</MkTextarea>
			<MkSwitch v-model="localOnly">{{ i18n.ts.localOnly }}</MkSwitch>
			<MkSwitch v-model="caseSensitive">{{ i18n.ts.caseSensitive }}</MkSwitch>
			<MkSwitch v-model="withFile">{{ i18n.ts.withFileAntenna }}</MkSwitch>
			<MkSwitch v-model="notify">{{ i18n.ts.notifyAntenna }}</MkSwitch>
		</div>
		<div :class="$style.actions">
			<MkButton inline primary @click="saveAntenna()"><i class="ti ti-device-floppy"></i> {{ i18n.ts.save }}</MkButton>
			<MkButton v-if="antenna.id != null" inline danger @click="deleteAntenna()"><i class="ti ti-trash"></i> {{ i18n.ts.delete }}</MkButton>
		</div>
	</div>
</MkSpacer>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import * as Misskey from 'misskey-js';
import MkButton from '@/components/MkButton.vue';
import MkInput from '@/components/MkInput.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkSelect from '@/components/MkSelect.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	antenna: any
}>();

const emit = defineEmits<{
	(ev: 'created'): void,
	(ev: 'updated'): void,
	(ev: 'deleted'): void,
}>();

let name: string = $ref(props.antenna.name);
let src: string = $ref(props.antenna.src);
let userListId: any = $ref(props.antenna.userListId);
let userGroupId: any = $ref(props.antenna.userGroupId);
let users: string = $ref(props.antenna.users.join('\n'));
let keywords: string = $ref(props.antenna.keywords.map(x => x.join(' ')).join('\n'));
let excludeKeywords: string = $ref(props.antenna.excludeKeywords.map(x => x.join(' ')).join('\n'));
let caseSensitive: boolean = $ref(props.antenna.caseSensitive);
let localOnly: boolean = $ref(props.antenna.localOnly);
let withReplies: boolean = $ref(props.antenna.withReplies);
let withFile: boolean = $ref(props.antenna.withFile);
let notify: boolean = $ref(props.antenna.notify);
let userLists: any = $ref(null);
let userGroups: any = $ref(null);

watch(() => src, async () => {
	if (src === 'list' && userLists === null) {
		userLists = await os.api('users/lists/list');
	}

	if (src === 'group' && userGroups === null) {
		const groups1 = await os.api('users/groups/owned');
		const groups2 = await os.api('users/groups/joined');

		userGroups = [...groups1, ...groups2];
	}
});

async function saveAntenna() {
	const antennaData = {
		name,
		src,
		userListId,
		userGroupId,
		withReplies,
		withFile,
		notify,
		caseSensitive,
		localOnly,
		users: users.trim().split('\n').map(x => x.trim()),
		keywords: keywords.trim().split('\n').map(x => x.trim().split(' ')),
		excludeKeywords: excludeKeywords.trim().split('\n').map(x => x.trim().split(' ')),
	};

	if (props.antenna.id == null) {
		await os.apiWithDialog('antennas/create', antennaData);
		emit('created');
	} else {
		antennaData['antennaId'] = props.antenna.id;
		await os.apiWithDialog('antennas/update', antennaData);
		emit('updated');
	}
}

async function deleteAntenna() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.t('removeAreYouSure', { x: props.antenna.name }),
	});
	if (canceled) return;

	await os.api('antennas/delete', {
		antennaId: props.antenna.id,
	});

	os.success();
	emit('deleted');
}

function addUser() {
	os.selectUser().then(user => {
		users = users.trim();
		users += '\n@' + Misskey.acct.toString(user as any);
		users = users.trim();
	});
}
</script>

<style lang="scss" module>
.actions {
	margin-top: 16px;
	padding: 24px 0;
	border-top: solid 0.5px var(--divider);
}
</style>
