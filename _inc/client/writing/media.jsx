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
	FormLabel,
	FormSelect
} from 'components/forms';
import { ModuleToggle } from 'components/module-toggle';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import { ModuleSettingCheckbox } from 'components/module-settings/form-components';
import SettingsCard from 'components/settings-card';
import { getModule } from 'state/modules';
import { isModuleFound as _isModuleFound } from 'state/search';

const Media = moduleSettingsForm(
	React.createClass( {

		toggleModule( name, value ) {
			if ( 'photon' === name ) {

				// Carousel depends on Photon. Deactivate it if Photon is deactivated.
				if ( false === ! value ) {
					this.props.updateOptions( { photon: false, 'tiled-gallery': false, tiled_galleries: false } );
				} else {
					this.props.updateOptions( { photon: true, 'tiled-gallery': true, tiled_galleries: true } );
				}
			} else {
				this.props.updateFormStateOptionValue( name, !value );
			}
		},

		render() {
			if (
				! this.props.isModuleFound( 'photon' )
				&& ! this.props.isModuleFound( 'carousel' )
			) {

				// Nothing to show here
				return <span />;
			}

			let photon   = this.props.module( 'photon' ),
				carousel = this.props.module( 'carousel' ),
				isCarouselActive = this.props.getOptionValue( 'carousel' );

			// Getting text data about modules and seeing if it's being searched for

			let photonSettings = (
				<FormFieldset support={ photon.learn_more_button }>
					<ModuleToggle slug="photon"
								  compact
								  activated={ this.props.getOptionValue( 'photon' ) }
								  toggling={ this.props.isSavingAnyOption( 'photon' ) }
								  toggleModule={ this.toggleModule }>
						<span className="jp-form-toggle-explanation">
							{
								photon.description
							}
						</span>
						<span className="jp-form-setting-explanation">
							{
								__( 'Enabling Photon is required to use Tiled Galleries.' )
							}
						</span>
					</ModuleToggle>
				</FormFieldset>
			);

			let carouselSettings = (
				<div>
					<ModuleToggle slug="carousel"
						compact
						activated={ isCarouselActive }
						toggling={ this.props.isSavingAnyOption( 'carousel' ) }
						toggleModule={ this.props.toggleModuleNow }>
					<span className="jp-form-toggle-explanation">
					{
						carousel.description
					}
					</span>
					</ModuleToggle>
					{
						isCarouselActive
						? <FormFieldset support={ carousel.learn_more_button }>
						<ModuleSettingCheckbox
							name={ 'carousel_display_exif' }
							{ ...this.props }
							label={ __( 'Show photo metadata (Exif) in carousel, when available' ) } />
						<FormLabel>
							<FormLegend className="jp-form-label-wide">{ __( 'Background color' ) }</FormLegend>
							<FormSelect
								name={ 'carousel_background_color' }
								value={ this.props.getOptionValue( 'carousel_background_color' ) }
								{ ...this.props }
								validValues={ this.props.validValues( 'carousel_background_color', 'carousel' ) }/>
						</FormLabel>
						</FormFieldset>
						: ''
					}
				</div>
			);

			return (
				<SettingsCard { ...this.props } header={ __( 'Media' ) }>
					{ this.props.isModuleFound( 'photon' ) && photonSettings }
					{ this.props.isModuleFound( 'carousel' ) && carouselSettings }
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
)( Media );
