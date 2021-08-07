import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { reduxForm, Field, startSubmit, formValueSelector } from 'redux-form';
import $ from 'jquery';
import clsx from 'clsx';
import { requestAnalysis } from '../../actions';
import CustomTextField from '../molecules/CustomTextField';
import ProductStatusCheckbox from '../molecules/ProductStatusCheckbox';
import CustomRadioButton from '../molecules/CustomRadioButton';
import SubmitButton from '../molecules/SubmitButton';
import radioOptionsObject from '../../constants/radioOptions';
import formCss from '../../style/form';
import formData from '../../constants/formData';

const scrollDownWindow = () => {
  const speed = 1000;
  const position = $('#result').offset().top;
  $('body,html').animate({ scrollTop: position }, speed, 'swing');
};

const submit = (dispatch) => {
  startSubmit(formData.analysis.name);
  dispatch(requestAnalysis());
  scrollDownWindow();
};

const getSelectedPlatform = (state) => {
  const selector = formValueSelector(formData.analysis.name);
  const platform = selector(state, 'platform');
  return platform || 'mercari';
};

let AnalysisForm = ({ handleSubmit, submitting, invalid, change }) => {
  // console.log('Form is rendered.');
  const platform = useSelector((state) => getSelectedPlatform(state));

  const { root, items, keywordError } = formCss();

  return (
    <form
      className={root}
      onSubmit={handleSubmit((values, dispatch) => {
        // submit(dispatch, change);
        submit(dispatch);
      })}
      encType="multipart/form-data"
    >
      <Field
        name="keyword"
        label="キーワード"
        component={CustomTextField}
        rootClass={clsx(items, keywordError)}
        required
      />
      <Field
        name="negKeyword"
        label="除外ワード"
        component={CustomTextField}
        rootClass={clsx(items, keywordError)}
      />
      <Field
        name="platform"
        label="フリマサイト"
        component={CustomRadioButton}
        options={radioOptionsObject.platform}
      />
      <Field
        name="searchTarget"
        label="検索対象"
        component={CustomRadioButton}
        options={radioOptionsObject.searchTarget}
      />
      {platform === 'mercari' && (
        <Field
          name="priceType"
          label="算出価格"
          component={CustomRadioButton}
          options={radioOptionsObject.priceType}
        />
      )}
      <Field
        name="searchRange"
        label="検索範囲"
        component={CustomRadioButton}
        options={radioOptionsObject.searchRange}
      />
      <Field
        name="productStatus"
        label="商品の状態"
        component={ProductStatusCheckbox}
        rootClass={items}
      />
      <Field
        name="deliveryCost"
        label="配送料の負担"
        component={CustomRadioButton}
        options={radioOptionsObject.deliveryCost}
      />
      <Field
        name="sortOrder"
        label="並びかえ"
        component={CustomRadioButton}
        options={radioOptionsObject.sortOrder}
      />
      <SubmitButton disabled={invalid || submitting} />
    </form>
  );
};

AnalysisForm = reduxForm({
  form: formData.analysis.name,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: formData.analysis.validate,
  initialValues: formData.analysis.initialValues,
})(AnalysisForm);

export default memo(AnalysisForm);
