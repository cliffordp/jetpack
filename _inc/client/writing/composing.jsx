/**
 * External dependencies
 */
import analytics from 'lib/analytics';
import React from 'react';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import {
	FormFieldset,
	FormLegend,
	FormLabel
} from 'components/forms';
import { getModule } from 'state/modules';
import { isModuleFound as _isModuleFound } from 'state/search';
import { ModuleToggle } from 'components/module-toggle';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import { ModuleSettingCheckbox } from 'components/module-settings/form-components';
import TagsInput from 'components/tags-input';
import SettingsCard from 'components/settings-card';
import InlineExpand from 'components/inline-expand';

const Composing = moduleSettingsForm(
	React.createClass( {
		getCheckbox( setting, label ) {
			return(
				<ModuleSettingCheckbox
					name={ setting }
					label={ label }
					{ ...this.props }
				/>
			);
		},

		getAtdSettings() {
			let ignoredPhrases = this.props.getOptionValue( 'ignored_phrases' );
			return (
				<div>
					<FormFieldset>
						<span className="jp-form-setting-explanation">
							{ __( 'Automatically proofread content when: ' ) }
						</span>
						{ this.getCheckbox( 'onpublish', __( 'A post or page is first published' ) ) }
						{ this.getCheckbox( 'onupdate', __( 'A post or page is updated' ) ) }
					</FormFieldset>
					<FormFieldset>
						<FormLegend> { __( 'Automatic Language Detection' ) }
						</FormLegend>
						<span className="jp-form-setting-explanation">
							{ __(
								  'The proofreader supports English, French, German, Portuguese and Spanish.'
							  ) }
						</span>
						{
							this.getCheckbox(
								'guess_lang',
								__( 'Use automatically detected language to proofread posts and pages' )
							)
						}
					</FormFieldset>
					<FormFieldset>
						<FormLegend> { __( 'English Options' ) } </FormLegend>
						<span className="jp-form-setting-explanation">
							{ __( 'Enable proofreading for the following grammar and style rules: ' ) }
						</span>
						{ this.getCheckbox( 'Bias Language', __( 'Bias Language' ) ) }
						{ this.getCheckbox( 'Cliches', __( 'Clichés' ) ) }
						{ this.getCheckbox( 'Complex Expression', __( 'Complex Phrases' ) ) }
						{ this.getCheckbox( 'Diacritical Marks', __( 'Diacritical Marks' ) ) }
						{ this.getCheckbox( 'Double Negative', __( 'Double Negatives' ) ) }
						{ this.getCheckbox( 'Hidden Verbs', __( 'Hidden Verbs' ) ) }
						{ this.getCheckbox( 'Jargon Language', __( 'Jargon' ) ) }
						{ this.getCheckbox( 'Passive voice', __( 'Passive Voice' ) ) }
						{ this.getCheckbox( 'Phrases to Avoid', __( 'Phrases to Avoid' ) ) }
						{ this.getCheckbox( 'Redundant Expression', __( 'Redundant Phrases' ) ) }
					</FormFieldset>
					<FormFieldset>
						<FormLegend>
							{ __( 'Ignored Phrases' ) }
						</FormLegend>
						<TagsInput
							name="ignored_phrases"
							placeholder={ __( 'Add a phrase' ) }
							value={
								'undefined' !== typeof ignoredPhrases && '' !== ignoredPhrases
									 ? ignoredPhrases.split( ',' )
									 : []
							}
							onChange={ this.props.onOptionChange } />
					</FormFieldset>
				</div>
			);
		},

		render() {

			// If we don't have any element to show, return early
			if (
				! this.props.isModuleFound( 'markdown' )
				&& ! this.props.isModuleFound( 'after-the-deadline' )
			) {
				return <span />;
			}

			let markdown = this.props.module( 'markdown' ),
				atd = this.props.module( 'after-the-deadline' );

			let markdownSettings = (
				<FormFieldset support={ markdown.learn_more_button }>
					<ModuleToggle slug="markdown"
								  compact
								  activated={ this.props.getOptionValue( 'markdown' ) }
								  toggling={ this.props.isSavingAnyOption( 'markdown' ) }
								  toggleModule={ this.props.toggleModuleNow }>
						<span className="jp-form-toggle-explanation">
							{ markdown.description }
						</span>
					</ModuleToggle>
				</FormFieldset>
			);

			let atdSettings = (
				<FormFieldset support={ atd.learn_more_button }>
					<ModuleToggle slug="after-the-deadline"
								  compact
								  activated={ this.props.getOptionValue( 'after-the-deadline' ) }
								  toggling={ this.props.isSavingAnyOption( 'after-the-deadline' ) }
								  toggleModule={ this.props.toggleModuleNow }>
						<span className="jp-form-toggle-explanation">
							{ atd.description }
						</span>
					</ModuleToggle>
					{
						this.props.getOptionValue( 'after-the-deadline' )
							? <InlineExpand label={ __( 'Fancy options' ) }>{ this.getAtdSettings() }</InlineExpand>
							: ''
					}
				</FormFieldset>
			);

			return (
				<SettingsCard header={ __( 'Composing', { context: 'Settings header' } ) } { ...this.props }>
					{ this.props.isModuleFound( 'markdown' ) && markdownSettings }
					{ this.props.isModuleFound( 'after-the-deadline' ) && atdSettings }
				</SettingsCard>
			);
		}
	} )
);

export default connect(
	( state ) => {
		return {
			module: ( module_name ) => getModule( state, module_name ),
			isModuleFound: ( module_name ) => _isModuleFound( state, module_name )
		}
	}
)( Composing );
